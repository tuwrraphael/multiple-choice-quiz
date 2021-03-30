export class Debouncer {
    private abort: () => void;
    constructor() {
    }

    private timeout(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    private aborter() {
        let status = {
            aborted: false,
            promise: <Promise<void>>null
        };
        let promise = new Promise<void>((resolve, reject) => {
            this.abort = () => {
                status.aborted = false;
                reject();
            };
        });
        status.promise = promise;
        return status;
    }

    async trigger(ms: number): Promise<void> {
        if (this.abort) {
            this.abort();
        }
        let status = this.aborter();
        try {
            await Promise.race([this.timeout(ms), status.promise]);
        }
        catch {
            throw new Error("aborted");
        }
    }
}
