/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  QuestChain,
  QuestChain_Initialized,
  QuestChain_Paused,
  QuestChain_QuestChainEdited,
  QuestChain_QuestChainInit,
  QuestChain_QuestChainTokenURIUpdated,
  QuestChain_QuestProofsSubmitted,
  QuestChain_QuestsCreated,
  QuestChain_QuestsEdited,
  QuestChain_RoleAdminChanged,
  QuestChain_RoleGranted,
  QuestChain_RoleRevoked,
  QuestChain_SetLimiter,
  QuestChain_Unpaused,
  QuestChainFactory,
  QuestChainFactory_AdminReplaceProposed,
  QuestChainFactory_AdminReplaced,
  QuestChainFactory_PaymentTokenReplaceProposed,
  QuestChainFactory_PaymentTokenReplaced,
  QuestChainFactory_QuestChainCreated,
  QuestChainFactory_QuestChainUpgraded,
  QuestChainFactory_UpgradeFeeReplaceProposed,
  QuestChainFactory_UpgradeFeeReplaced,
  QuestChainToken,
  QuestChainToken_ApprovalForAll,
  QuestChainToken_TransferBatch,
  QuestChainToken_TransferSingle,
  QuestChainToken_URI,
} from "generated"

/* Quest Chain Factory */

QuestChainFactory.AdminReplaceProposed.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_AdminReplaceProposed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    proposedAdmin: event.params.proposedAdmin,
  }

  context.QuestChainFactory_AdminReplaceProposed.set(entity)
})

QuestChainFactory.AdminReplaced.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_AdminReplaced = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    admin: event.params.admin,
  }

  context.QuestChainFactory_AdminReplaced.set(entity)
})

QuestChainFactory.PaymentTokenReplaceProposed.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_PaymentTokenReplaceProposed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    proposedPaymentToken: event.params.proposedPaymentToken,
  }

  context.QuestChainFactory_PaymentTokenReplaceProposed.set(entity)
})

QuestChainFactory.PaymentTokenReplaced.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_PaymentTokenReplaced = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    paymentToken: event.params.paymentToken,
  }

  context.QuestChainFactory_PaymentTokenReplaced.set(entity)
})

QuestChainFactory.QuestChainCreated.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_QuestChainCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    index: event.params.index,
    questChain: event.params.questChain,
  }

  context.QuestChainFactory_QuestChainCreated.set(entity)
})

QuestChainFactory.QuestChainCreated.contractRegister(({ event, context }) => {
  console.debug({ register: event.params.questChain })
  context.addQuestChain(event.params.questChain)
})

QuestChainFactory.QuestChainUpgraded.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_QuestChainUpgraded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    questChain: event.params.questChain,
  }

  context.QuestChainFactory_QuestChainUpgraded.set(entity)
})

QuestChainFactory.UpgradeFeeReplaceProposed.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_UpgradeFeeReplaceProposed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    proposedUpgradeFee: event.params.proposedUpgradeFee,
  }

  context.QuestChainFactory_UpgradeFeeReplaceProposed.set(entity)
})

QuestChainFactory.UpgradeFeeReplaced.handler(async ({ event, context }) => {
  const entity: QuestChainFactory_UpgradeFeeReplaced = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    upgradeFee: event.params.upgradeFee,
  }

  context.QuestChainFactory_UpgradeFeeReplaced.set(entity)
})

/* Quest Chain */

QuestChain.Initialized.handler(async ({ event, context }) => {
  const entity: QuestChain_Initialized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    version: event.params.version,
  }

  context.QuestChain_Initialized.set(entity)
})

QuestChain.Paused.handler(async ({ event, context }) => {
  const entity: QuestChain_Paused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
  }

  context.QuestChain_Paused.set(entity)
})

QuestChain.QuestChainEdited.handler(async ({ event, context }) => {
  const entity: QuestChain_QuestChainEdited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    editor: event.params.editor,
    details: event.params.details,
  }

  context.QuestChain_QuestChainEdited.set(entity)
})

type ChapterBase = {
  name: string
  description: string
}

type BookBase = {
  name: string
  description: string
  slug: string
  categories: Array<string>
}


const toHTTP = (url: string) => {
  const prefix = 'https://w3s.link/ipfs/'
  let out = url.replace(/^ipfs:\/\//, prefix)
  if(!out.includes('://')) {
    out = `${prefix}${out}`
  }
  return out
}

QuestChain.QuestChainInit.handler(async ({ event, context }) => {
  const entity: QuestChain_QuestChainInit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    details: event.params.details,
    quests: event.params.quests,
    paused: event.params.paused,
  }

  context.QuestChain_QuestChainInit.set(entity)

  const { srcAddress: checksummedContract, transaction: { from: creator } } = (
    event
  )
  const contract = checksummedContract.toLowerCase()

  const res = await fetch(toHTTP(entity.details))
  const { name, description, slug, categories } = await res.json() as BookBase
  const now = new Date(event.block.timestamp)
  if(!contract) {
    throw new Error('Contract address not found.')
  }
  if(!creator) {
    throw new Error('Creator address not found.')
  }

  context.Book.set({
    id: contract,
    title: name,
    introduction: description,
    slug,
    creator,
    createdAt: now,
    updatedAt: now,
    source: entity.details,
    contract,
    nft_id: undefined,
    owners: [creator],
    status: 'created',
  })

  await Promise.allSettled(
    entity.quests.map(async (url, idx) => {
      try {
        const res = await fetch(toHTTP(url))
        if(!res.ok) {
          throw new Error(`Respoonse not ok: ${res.status} (${url})`)
        }
        const { name, description } = await res.json() as ChapterBase
        context.Chapter.set({
          id: `${contract}_${idx + 1}`,
          title: name,
          book_id: contract,
          content: description,
          optional: false,
          source: url,
          status: 'created',
          editedAt: undefined,
        })
      } catch(error) {
        console.error({ error })
        context.Chapter.set({
          id: `${contract}_${idx + 1}`,
          title: 'Bad URL!',
          book_id: contract,
          content: 'Bad URL!',
          optional: false,
          source: url,
          status: 'created',
          editedAt: undefined,
        })
      }
    })
  )
})

QuestChain.QuestChainTokenURIUpdated.handler(async ({ event, context }) => {
  const entity: QuestChain_QuestChainTokenURIUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tokenURI: event.params.tokenURI,
  }

  context.QuestChain_QuestChainTokenURIUpdated.set(entity)
})

QuestChain.QuestProofsSubmitted.handler(async ({ event, context }) => {
  const entity: QuestChain_QuestProofsSubmitted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    quester: event.params.quester,
    questIdList: event.params.questIdList,
    proofList: event.params.proofList,
  }

  context.QuestChain_QuestProofsSubmitted.set(entity)
})

QuestChain.QuestsCreated.handler(async ({ event, context }) => {
  const entity: QuestChain_QuestsCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    creator: event.params.creator,
    detailsList: event.params.detailsList,
  }

  context.QuestChain_QuestsCreated.set(entity)
})

QuestChain.QuestsEdited.handler(async ({ event, context }) => {
  const entity: QuestChain_QuestsEdited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    editor: event.params.editor,
    questIdList: event.params.questIdList,
    detailsList: event.params.detailsList,
  }

  context.QuestChain_QuestsEdited.set(entity)

  const { srcAddress: checksummedContract } = event
  const contract = checksummedContract.toLowerCase()

  await Promise.allSettled(
    event.params.detailsList.map(async (cid, idx) => {
      try {
        const chapterId = event.params.questIdList[idx]
        const id = `${contract}_${chapterId + 1n}`
        const chapter = await context.Chapter.get(id)

        if(!chapter) {
          throw new Error(`Chapter not found: ${id}`)
        }

        let source = cid
        if(!cid.includes('://')) {
          source = `ipfs://${cid}`
        }

        const res = await fetch(toHTTP(cid))
        if(!res.ok) {
          throw new Error(`Response not ok: ${res.status} (${cid})`)
        }
        const { name, description } = await res.json() as ChapterBase
        context.Chapter.set({
          ...chapter,
          title: name,
          content: description,
          editedAt: new Date(event.block.timestamp),
          source,
        })
      } catch(error) {
        console.error({ error })
      }
    })
  )
})

QuestChain.RoleAdminChanged.handler(async ({ event, context }) => {
  const entity: QuestChain_RoleAdminChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    previousAdminRole: event.params.previousAdminRole,
    newAdminRole: event.params.newAdminRole,
  }

  context.QuestChain_RoleAdminChanged.set(entity)
})

QuestChain.RoleGranted.handler(async ({ event, context }) => {
  const entity: QuestChain_RoleGranted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  }

  context.QuestChain_RoleGranted.set(entity)
})

QuestChain.RoleRevoked.handler(async ({ event, context }) => {
  const entity: QuestChain_RoleRevoked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    role: event.params.role,
    account: event.params.account,
    sender: event.params.sender,
  }

  context.QuestChain_RoleRevoked.set(entity)
})

QuestChain.SetLimiter.handler(async ({ event, context }) => {
  const entity: QuestChain_SetLimiter = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    limiterContract: event.params.limiterContract,
  }

  context.QuestChain_SetLimiter.set(entity)
})

QuestChain.Unpaused.handler(async ({ event, context }) => {
  const entity: QuestChain_Unpaused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
  }

  context.QuestChain_Unpaused.set(entity)
})

/* Quest Chain Token */

QuestChainToken.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: QuestChainToken_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
    operator: event.params.operator,
    approved: event.params.approved,
  }

  context.QuestChainToken_ApprovalForAll.set(entity)
})

QuestChainToken.TransferBatch.handler(async ({ event, context }) => {
  const entity: QuestChainToken_TransferBatch = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    operator: event.params.operator,
    from: event.params.from,
    to: event.params.to,
    ids: event.params.ids,
    values: event.params.values,
  }

  context.QuestChainToken_TransferBatch.set(entity)
})

QuestChainToken.TransferSingle.handler(async ({ event, context }) => {
  const entity: QuestChainToken_TransferSingle = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    operator: event.params.operator,
    from: event.params.from,
    to: event.params.to,
    event_id: event.params.id,
    value: event.params.value,
  }

  context.QuestChainToken_TransferSingle.set(entity)
})

QuestChainToken.URI.handler(async ({ event, context }) => {
  const entity: QuestChainToken_URI = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
    event_id: event.params.id,
  }

  context.QuestChainToken_URI.set(entity)
})
