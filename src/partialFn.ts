// Placeholder for partial application
export const partialFn_ = Symbol('placeholder');

export function partialFn<T extends (...args: any[]) => any>(fn: T, ...boundArgs: any[]): (...args: any[]) => ReturnType<T> {
    return function (this: any, ...callArgs: any[]): ReturnType<T> {
        const resultArgs: any[] = [];
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

        return fn.apply(this, resultArgs);
    };
}
