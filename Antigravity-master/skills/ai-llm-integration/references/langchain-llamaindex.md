# LangChain & LlamaIndex Framework Integration

## LangChain Expression Language (LCEL)
```typescript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = PromptTemplate.fromTemplate("Summarize this text: {text}");
const model = new ChatOpenAI({ modelName: "gpt-4o-mini" });
const chain = prompt.pipe(model).pipe(new StringOutputParser());

const result = await chain.invoke({ text: "..." });
```

## LlamaIndex Vector Store Query Engine
```typescript
import { VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";

const documents = await new SimpleDirectoryReader().loadData({ directoryPath: "./data" });
const index = await VectorStoreIndex.fromDocuments(documents);
const queryEngine = index.asQueryEngine();
const response = await queryEngine.query({ query: "What are the project requirements?" });
```
