function processTransactions(transactions) {

  let balances = new Map();
  let rejected = [];
  let result = new Map(['balance', {}], ['rejected', []]);

  for (const transaction of  transactions) {

    let balance = result.get(transaction.accountId) ?? 0;

    if (transaction.type === 'withdraw') {
      if (balance < transaction.amount) {
        rejected.push(transaction)
        continue;
      }

      balances.set('balances',  balances.get(transaction.accountId) - transaction.amount ) ;
      continue;
    }
    balances.set('balances',  balances.get(transaction.accountId) + transaction.amount ) ;

  }

  return {
    balances: Object.fromEntries(balances),
    rejected
  }

}
