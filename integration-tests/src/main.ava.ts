import { Worker, NEAR, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';


const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createAccount("contract");
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract };
});

test.afterEach(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("create subaccount and get accounts count", async (t) => {
  const { root, contract } = t.context.accounts;
  
  // Create a subaccount
  await root.call(contract.accountId, "create_subaccount", {
    pre_fix: "prefix",
    public_key: "PUBLIC_KEY",
    access_key: "ACCESS_KEY",
  });

  // Get accounts count
  const accountsCount = await contract.view("get_accounts_count");

  // Assert the result
  t.is(accountsCount, 1);
});

test("get accounts", async (t) => {
  const { root, contract } = t.context.accounts;

  // Create a subaccount
  await root.call(contract.accountId, "create_subaccount", {
    pre_fix: "prefix",
    public_key: "PUBLIC_KEY",
    access_key: "ACCESS_KEY",
  });

  // Get accounts
  const accounts = await contract.view("get_accounts");

  // Assert the result
  t.deepEqual(accounts, [["prefix.account1", "TIMESTAMP"]]);
});
