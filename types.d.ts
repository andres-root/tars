type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type Chunks = AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;

// type View = 'CPU' | 'RAM' | 'STORAGE';

// type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  getOpenAICompletionsAsStream: Promise<Chunks>;
  chatChunk: OpenAI.Chat.Completions.ChatCompletionChunk;
  // changeView: View;
  // sendFrameAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    getOpenAICompletionsAsStream: () => Promise<Chunks>;
    // subscribeChangeView: (
    //   callback: (view: View) => void
    // ) => UnsubscribeFunction;
    // sendFrameAction: (payload: FrameWindowAction) => void;
  };
}