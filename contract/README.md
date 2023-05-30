# Main Contract

The smart contract implements Subaccount Creation and adding a function access key
also view methods to show the created subaccounds.

```ts
create_subaccount({ pre_fix, public_key , access_key}: { pre_fix: string, public_key: string, access_key: string})
```

```ts
   get_accounts_count(): number {
    return this.createdAccounts.length;
  }
```
```ts
   get_accounts(){
    return this.createdAccounts.toArray();
  }
```

<br />

# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16.
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Deploy the Contract
You can automatically compile and deploy the contract in the NEAR testnet by running:

```bash
npm run deploy
```
You can change the network by prepending an environment variable to your command.
`NEAR_ENV=testnet near send ...`

Alternatively, you can set up a global environment variable by running:
`export NEAR_ENV=mainnet`


Once finished, check the `neardev/dev-account` file to find the address in which the contract was deployed:

```bash
cat ./neardev/dev-account
```

<br />

## 2. Get number of subaccounts created
`get_accounts_count` performs read-only operations, therefore it is a `view` method.

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
# Use near-cli to get the points
near view <dev-account> get_accounts_count '{}'
```

<br />

## 3. Create a subaccount and add function access
`create_subaccount` takes the passed `pre_fix` to create a sub account

It changes the contract's state, for which it is a `call` method.

`Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction.

```bash
# Use near-cli to play
near call <dev-account> create_subaccount '{"pre_fix":"newaccount", "public_key":"PUBLICKEY", "access_key":"ACCESSKEY"}' --accountId <dev-account>
```

**Tip:** If you would like to call `create_subaccount` using your own account, first login into NEAR using:

```bash
# Use near-cli to login your NEAR account
near login
```
