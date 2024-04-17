import {
  Transfer as TransferEvent
} from "../generated/AIdoge/AIdoge"
import {
  Transfer
} from "../generated/schema"

const tokenName = "AIdoge"
export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.name = tokenName
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
