// Placeholder for partial application
export const partialFn_ = Symbol('placeholder');

export function partialFn<T extends (...args: unknown[]) => unknown>(fn: T, ...boundArgs: unknown[]): (...args: unknown[]) => ReturnType<T> {
    return function (this: unknown, ...callArgs: unknown[]): ReturnType<T> {
        const resultArgs: unknown[] = [];
        let nextArg = 0;

        // Replace placeholders with call-time arguments
        for (let i = 0; i < boundArgs.length; i++) {
            if (boundArgs[i] === partialFn_) {
                resultArgs[i] = callArgs[nextArg++];
            } else {
                resultArgs[i] = boundArgs[i];
            }
        }

        // Append any remaining call-time arguments
        for (; nextArg < callArgs.length; nextArg++) {
            resultArgs.push(callArgs[nextArg]);
        }

        return fn.apply(this, resultArgs) as ReturnType<T>;
    };
}

// Wrapper that resolves field references before calling partialFn
export function partialFnWithFields<T extends (...args: unknown[]) => unknown>(fn: T, ...boundArgs: unknown[]): (value: unknown, formValues?: { [key: string]: unknown }) => ReturnType<T> {
    return function (value: unknown, formValues?: { [key: string]: unknown }): ReturnType<T> {
        // Resolve field references in boundArgs
        const resolvedArgs = boundArgs.map(arg => {
            if (typeof arg === 'string' && arg.startsWith('@') && formValues) {
                return formValues[arg.slice(1)];
            }
            return arg;
        });

        // Create the partial function with resolved values
        const partializedFn = partialFn(fn, ...resolvedArgs);
        return partializedFn(value);
    };
}
