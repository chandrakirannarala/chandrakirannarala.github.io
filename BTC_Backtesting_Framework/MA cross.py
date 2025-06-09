import backtrader as bt
import backtrader.analyzers as bta
from datetime import datetime
import matplotlib.pyplot as plt
import yfinance as yf
import pandas as pd


class MaCrossStrategy(bt.Strategy):
    params = (
        ('fast_period', 10),
        ('slow_period', 20),
        ('stop_loss', 0.05),  # 5% stop loss
        ('take_profit', 0.15),  # 15% take profit
    )

    def __init__(self):
        # Moving averages
        self.ma_fast = bt.ind.SMA(period=self.params.fast_period)
        self.ma_slow = bt.ind.SMA(period=self.params.slow_period)
        
        # Crossover signal
        self.crossover = bt.ind.CrossOver(self.ma_fast, self.ma_slow)
        
        # RSI for additional confirmation
        self.rsi = bt.ind.RSI(period=14)
        
        # Track order and entry price
        self.order = None
        self.entry_price = None

    def notify_order(self, order):
        if order.status in [order.Completed]:
            if order.isbuy():
                self.entry_price = order.executed.price
                print(f'BUY EXECUTED: Price: {order.executed.price:.2f}')
            else:
                print(f'SELL EXECUTED: Price: {order.executed.price:.2f}')
        
        self.order = None

    def next(self):
        # Cancel pending orders
        if self.order:
            return

        if not self.position:
            # Entry conditions: MA crossover + RSI not overbought
            if self.crossover > 0 and self.rsi < 70:
                self.order = self.buy()
        else:
            # Exit conditions
            current_price = self.data.close[0]
            
            # Stop loss
            if self.entry_price and current_price <= self.entry_price * (1 - self.params.stop_loss):
                self.order = self.close()
                print(f'STOP LOSS at {current_price:.2f}')
            
            # Take profit
            elif self.entry_price and current_price >= self.entry_price * (1 + self.params.take_profit):
                self.order = self.close()
                print(f'TAKE PROFIT at {current_price:.2f}')
            
            # MA crossover exit
            elif self.crossover < 0:
                self.order = self.close()


def download_data(symbol='BTC-USD', period='2y'):
    """Download data from Yahoo Finance"""
    try:
        # Download data with auto_adjust=False to avoid the warning
        data = yf.download(symbol, period=period, auto_adjust=False, prepost=True, threads=True)
        
        # Flatten multi-level columns if they exist
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.droplevel(1)
        
        # Ensure column names are lowercase and properly formatted
        data.columns = [col.lower() for col in data.columns]
        
        # Remove any rows with NaN values
        data = data.dropna()
        
        print(f"Downloaded {len(data)} rows of data")
        print(f"Columns: {list(data.columns)}")
        print(f"Date range: {data.index[0]} to {data.index[-1]}")
        
        return data
    except Exception as e:
        print(f"Error downloading data: {e}")
        return None


def run_backtest():
    cerebro = bt.Cerebro()
    
    # Download and prepare data
    print("Downloading BTC-USD data...")
    df = download_data('BTC-USD', '2y')
    
    if df is None or df.empty:
        print("Failed to download data")
        return
    
    # Convert to backtrader format with explicit column mapping
    data = bt.feeds.PandasData(
        dataname=df,
        datetime=None,  # Use index as datetime
        open='open',
        high='high',
        low='low',
        close='close',
        volume='volume',
        openinterest=None
    )
    cerebro.adddata(data)
    
    # Add strategy
    cerebro.addstrategy(MaCrossStrategy)
    
    # Set broker parameters
    cerebro.broker.setcash(10000.0)  # Increased starting capital
    cerebro.broker.setcommission(commission=0.001)  # 0.1% commission
    
    # Position sizing - risk 2% per trade
    cerebro.addsizer(bt.sizers.PercentSizer, percents=20)
    
    # Add analyzers
    cerebro.addanalyzer(bta.SharpeRatio, _name="sharpe", riskfreerate=0.02)  # 2% risk-free rate
    cerebro.addanalyzer(bta.Returns, _name="returns")
    cerebro.addanalyzer(bta.TradeAnalyzer, _name="trades")
    cerebro.addanalyzer(bta.DrawDown, _name="drawdown")
    cerebro.addanalyzer(bta.Transactions, _name="transactions")
    
    print(f"Starting Portfolio Value: ${cerebro.broker.getvalue():.2f}")
    
    # Run backtest
    results = cerebro.run()
    strategy = results[0]
    
    print(f"Final Portfolio Value: ${cerebro.broker.getvalue():.2f}")
    print(f"Total Return: {((cerebro.broker.getvalue() / 10000) - 1) * 100:.2f}%")
    
    # Extract and print results
    sharpe_analysis = strategy.analyzers.sharpe.get_analysis()
    returns_analysis = strategy.analyzers.returns.get_analysis()
    trades_analysis = strategy.analyzers.trades.get_analysis()
    drawdown_analysis = strategy.analyzers.drawdown.get_analysis()
    
    print("\n=== PERFORMANCE METRICS ===")
    
    # Sharpe Ratio
    sharpe_ratio = sharpe_analysis.get('sharperatio', 'N/A')
    print(f"Sharpe Ratio: {sharpe_ratio}")
    
    # Returns
    total_return = returns_analysis.get('rtot', 0) * 100
    average_return = returns_analysis.get('ravg', 0) * 100
    print(f"Total Return: {total_return:.2f}%")
    print(f"Average Return: {average_return:.4f}%")
    
    # Trades
    total_trades = trades_analysis.get('total', {}).get('total', 0)
    won_trades = trades_analysis.get('won', {}).get('total', 0)
    lost_trades = trades_analysis.get('lost', {}).get('total', 0)
    
    if total_trades > 0:
        win_rate = (won_trades / total_trades) * 100
        print(f"Total Trades: {total_trades}")
        print(f"Win Rate: {win_rate:.2f}%")
        
        if won_trades > 0:
            avg_win = trades_analysis.get('won', {}).get('pnl', {}).get('average', 0)
            print(f"Average Win: ${avg_win:.2f}")
        
        if lost_trades > 0:
            avg_loss = trades_analysis.get('lost', {}).get('pnl', {}).get('average', 0)
            print(f"Average Loss: ${avg_loss:.2f}")
    
    # Drawdown
    max_drawdown = drawdown_analysis.get('max', {}).get('drawdown', 0) * 100
    print(f"Max Drawdown: {max_drawdown:.2f}%")
    
    return cerebro, strategy


def setup_plot_style():
    """Setup plotting style"""
    plt.style.use('fivethirtyeight')
    
    plt.rcParams["figure.figsize"] = (15, 10)
    plt.rcParams['lines.linewidth'] = 1
    
    SIZE = 8
    plt.rcParams['axes.labelsize'] = SIZE
    plt.rcParams['ytick.labelsize'] = SIZE
    plt.rcParams['xtick.labelsize'] = SIZE
    plt.rcParams["font.size"] = SIZE
    
    COLOR = '1'
    plt.rcParams['text.color'] = COLOR
    plt.rcParams['axes.labelcolor'] = COLOR
    plt.rcParams['xtick.color'] = COLOR
    plt.rcParams['ytick.color'] = COLOR
    
    plt.rcParams['grid.linewidth'] = 0.1
    plt.rcParams['grid.color'] = "#101622"
    plt.rcParams['lines.color'] = "0.5"
    plt.rcParams['axes.edgecolor'] = "0.2"
    plt.rcParams['axes.linewidth'] = 0.5
    
    plt.rcParams['figure.facecolor'] = "#101622"
    plt.rcParams['axes.facecolor'] = "#101622"
    plt.rcParams["savefig.dpi"] = 120
    plt.rcParams["savefig.facecolor"] = "#101622"
    plt.rcParams["savefig.edgecolor"] = "#101622"
    
    plt.rcParams['legend.fontsize'] = SIZE
    plt.rcParams['legend.title_fontsize'] = SIZE + 1


if __name__ == "__main__":
    # Run the backtest
    cerebro, strategy = run_backtest()
    
    # Setup and show plot
    setup_plot_style()
    cerebro.plot(style='candle', barup='white', bardown='#1973c2', volume=False)
    plt.show()