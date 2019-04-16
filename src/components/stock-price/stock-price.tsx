import { Component, State, Prop, Watch, Listen } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'rz-stock-price',
  styleUrl: 'stock-price.scss',
  shadow: true
})
export class StockPrice {
  stockInput: HTMLInputElement;
  // initialStockSymbol: string;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @State() loading = false;

  @Prop({mutable: true, reflectToAttr: true}) stockSymbol: string;

  @Watch('stockSymbol') 
  stockSymbolChanged(newValue: string, oldValue: string) {
    if(newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }

  @Listen('body:rzSymbolSelected')
  onStockSymbolSelected(event: CustomEvent) {
    console.log('stock symbol selected: ', event.detail);
    if(event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail;
      this.stockInputValid = true;
    } 
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;
    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
    )
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Invalid!');
        }
        return res.json();
      })
      .then(parsedRes => {
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid symbol!');
        }
        this.error = null;
        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
        this.loading = false
      })
      .catch(err => {
        this.error = err.message;
        this.fetchedPrice = null;
        this.loading = false;
      });
  }

  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();
    this.stockSymbol = this.stockInput.value;
    // this.fetchStockPrice(this.stockSymbol);
  }

  componentDidLoad() {
    if(this.stockSymbol) {
      this.stockUserInput = this.stockSymbol;
      // this.initialStockSymbol = this.stockSymbol;
      this.stockInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentDidUpdate() {
    // if(this.stockSymbol !== this.initialStockSymbol) {
    //   this.initialStockSymbol = this.stockSymbol;
    //   this.fetchStockPrice(this.stockSymbol);
    // }
  }

  hostData() {
    return {
      class: this.error ? 'error' : ''
    }
  }

  render() {
    let dataContent = <p>Please enter a symbol</p>;
    if(this.error) {
      dataContent = <p>{this.error}</p>
    }
    if(this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }
    if(this.loading) {
      dataContent = <rz-spinner></rz-spinner>
    }
    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input 
          id="stock-symbol" 
          ref={el => (this.stockInput = el)} 
          value={this.stockUserInput}
          onInput={this.onUserInput.bind(this)}
        />

        <button type="submit" disabled={!this.stockInputValid || this.loading}>Fetch</button>
      </form>,
      <div>
        {dataContent}
      </div>
    ]
  }
}