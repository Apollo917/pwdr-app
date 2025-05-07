import { Context, use } from 'react';

// Types

export interface InitializableContext {
  initialized: boolean;
}

// Errors

export class ContextIsNotInitializedError extends Error {

  constructor(contextName: string | undefined) {
    super(`"${contextName ?? 'UNKNOWN context'}" is not initialized`);
  }

}

// Hooks

export const useInitializableContext = <T extends InitializableContext>(context: Context<T>): T => {
  const ctx = use(context);
  if (!ctx.initialized) throw new ContextIsNotInitializedError(context.displayName);
  return ctx;
};