# StockLooper Web App  

## Description  
StockLooper is a web application designed for exploratory financial analysis and stock-price simulation. Built as a prototype, it allows users to apply a Monte Carlo simulation engine to model the future behavior of a stock, test assumptions under different market conditions, and visualise the distribution of possible outcomes.

Live Demo: [https://stocklooper.web.app](https://stocklooper.web.app)

---

## What is a Monte Carlo Simulation?  
A Monte Carlo simulation is a computational algorithm that uses repeated random sampling to model the probability of different outcomes in systems subject to uncertainty. :contentReference[oaicite:2]{index=2}

Key points:  
- It generates many possible scenarios by varying input variables according to defined probability distributions.  
- By aggregating results, it provides a range of likely outcomes and their probabilities (instead of a single deterministic forecast).  
- It’s widely used in finance to evaluate risk, simulate stock-price trajectories, assess portfolios, and more. :contentReference[oaicite:3]{index=3}  
- Steps typically include: define the model, specify input distributions, run many iterations, analyse the outcome distribution. :contentReference[oaicite:4]{index=4}  

---

## How StockLooper Uses It  
In StockLooper, the Monte Carlo simulation module enables:  
- Input of stock-specific metrics (e.g., dividends, shares outstanding, earnings) and market variables (e.g., interest rates, volatility).  
- Execution of a large number of simulated **price paths** for the stock over a given time horizon.  
- Generation of a **probability distribution** of future stock prices or valuation outcomes.  
- Visualisation of key outputs: median estimate, confidence intervals, best/worst case scenarios.  
- Sensitivity insight: which variables (internal or external) drive the most variance in outcomes.

---

## Features  
- Responsive web interface (works on desktop and mobile)  
- Real-time user input adjustment (volatility, time horizon, share metrics)  
- Visual output: graphs/histograms of simulated results  
- Export or snapshot of results for further analysis  
- Designed for educational and prototype use (not financial advice)

---
