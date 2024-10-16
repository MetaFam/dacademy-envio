import assert from "assert";
import { 
  TestHelpers,
  QuestChain_Initialized
} from "generated";
const { MockDb, QuestChain } = TestHelpers;

describe("QuestChain contract Initialized event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for QuestChain contract Initialized event
  const event = QuestChain.Initialized.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("QuestChain_Initialized is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await QuestChain.Initialized.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualQuestChainInitialized = mockDbUpdated.entities.QuestChain_Initialized.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedQuestChainInitialized: QuestChain_Initialized = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      version: event.params.version,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualQuestChainInitialized, expectedQuestChainInitialized, "Actual QuestChainInitialized should be the same as the expectedQuestChainInitialized");
  });
});
