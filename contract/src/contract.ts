import { NearBindgen, near, call, NearPromise, view, PublicKey } from 'near-sdk-js'
import { UnorderedMap } from 'near-sdk-js'

const SUBACCOUNT_CREATION: bigint = BigInt("1000000000000000000000") // 0.001Ⓝ
const TESTNET_CREATION: bigint = BigInt("1820000000000000000000") // 0.0182Ⓝ
const ALLOWANCE: bigint = BigInt("250000000000000000000000") // 0.25Ⓝ

const THIRTY_TGAS = BigInt("30000000000000");
@NearBindgen({})
class Contract {
  createdAccounts : UnorderedMap<string> = new UnorderedMap("createdAccounts")

  @call({})
  create_subaccount({ pre_fix, public_key , access_key}: { pre_fix: string, public_key: string, access_key: string}): NearPromise {
    // Test creating accounts which are a pre_fix of THIS CONTRACT
    // <pre_fix>.<current-account-id>
    near.log(`the pre_fix is ${pre_fix}`)
    const account_id = `${pre_fix}.${near.currentAccountId()}`
    this.createdAccounts.set(account_id.toString(), near.blockTimestamp().toString());

    return NearPromise.new(account_id)
      .createAccount()
      .transfer(TESTNET_CREATION)
      .addFullAccessKey(PublicKey.fromString(public_key))
      .addAccessKey(
        PublicKey.fromString(access_key),
        ALLOWANCE,
        near.currentAccountId(),
        "get_accounts_count"
        )    
  }

  @view({})
  get_accounts_count(): number {
    return this.createdAccounts.length;
  }

  @view({privateFunction: true})
  get_accounts(){
    return this.createdAccounts.toArray();
  }


}