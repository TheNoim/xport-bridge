import PQueue from 'p-queue';

/**
 * Queue Promises
 * @param queueName
 * @param withTimeout add an timeout (-1 = disabled)
 */
export function Queue(queueName: string, withTimeout: number = -1) {
    return function(
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ) {
        var originalMethod = descriptor.value;
        const queue = getOrCreateQueue(queueName);
        descriptor.value = async function(...args) {
            return await queue.add(() => {
                const promise = originalMethod.bind(this)(...args);
                return withTimeout > -1
                    ? promiseTimeout(withTimeout, promise)
                    : promise;
            });
        };
        return descriptor;
    };
}

const queues = {};

function getOrCreateQueue(name: string) {
    if (!queues[name]) queues[name] = new PQueue({ concurrency: 1 });
    return queues[name];
}

const promiseTimeout = function<T>(
    ms: number,
    promise: Promise<T>,
): Promise<T | any> {
    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.');
        }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
};
