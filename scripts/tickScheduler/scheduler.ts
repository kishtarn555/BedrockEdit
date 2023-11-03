import { system,world } from "@minecraft/server"


export class ChainReturner<ChainOut> {
    resolver: (value: ChainOut) => void;
    private resolved: boolean;
    constructor(resolver: (value: ChainOut) => void) {
        this.resolver = resolver;
        this.resolved = false;
    }

    breakAndReturn(value: ChainOut) {
        this.resolver(value);
        this.resolved = true;
    }

    hasReturned() {
        return this.resolved;
    }

}

class TickChainEnd<In, ChainIn, ChainOut> {
    callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<ChainOut>
    chain: TickChain<ChainIn, ChainOut>

    constructor(callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<ChainOut>, chain: TickChain<ChainIn, ChainOut>) {
        this.callback = callback;
        this.chain = chain;
    }

    _run(resolve: (value: ChainOut) => void, reject: (reason: any) => void, arg: In, returner: ChainReturner<ChainOut>) {
        if (returner.hasReturned()) return;
        system.run(() => {
            let response = this.callback(returner, arg)
                .then(response => resolve(response));
        });
    }

    run(input: ChainIn): Promise<ChainOut> {
        return new Promise<ChainOut>(
            (resolve, reject) => {
                let returner = new ChainReturner<ChainOut>(resolve);
                this.chain._run(resolve, reject, input, returner);
            }
        );
    }
}

class TickChainLink<In, Out, ChainIn, ChainOut> {
    callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<Out>
    chain: TickChain<ChainIn, ChainOut>
    nextLink: TickChainLink<Out, any, ChainIn, ChainOut> | TickChainEnd<Out, ChainIn, ChainOut> | undefined
    constructor(callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<Out>, chain: TickChain<ChainIn, ChainOut>) {
        this.callback = callback;
        this.chain = chain;
    }

    next<Out2 = undefined>(callback: (returner: ChainReturner<ChainOut>, arg: Out) => Promise<Out2>) {
        this.nextLink = new TickChainLink(callback, this.chain);
        return this.nextLink;
    }

    finally(callback: (returner: ChainReturner<ChainOut>, arg: Out) => Promise<ChainOut>) {
        this.nextLink = new TickChainEnd(callback, this.chain);
        return this.nextLink;

    }


    _run(resolve: (value: ChainOut) => void, reject: (reason: any) => void, arg: In, returner: ChainReturner<ChainOut>) {
        if (returner.hasReturned()) return;
        system.run(() => {
            this.callback(returner, arg).then((response) => {
                if (this.nextLink) {
                    this.nextLink?._run(resolve, reject, response, returner);
                } else {
                    reject("Chain is broken!");
                }
            });
        });
    }
}


export class TickChain<ChainIn, ChainOut> {

    FirstLink: TickChainLink<ChainIn, any, ChainIn, ChainOut> | undefined
    first<Out>(callback: (returner: ChainReturner<ChainOut>, arg: ChainIn) => Promise<Out>): TickChainLink<ChainIn, Out, ChainIn, ChainOut> {
        this.FirstLink = new TickChainLink<ChainIn, Out, ChainIn, ChainOut>(callback, this);

        return this.FirstLink
    }

    _run(resolve: (value: ChainOut) => void, reject: (reason: any) => void, input: ChainIn, returner: ChainReturner<ChainOut>) {
        if (returner.hasReturned()) return;
        this.FirstLink!._run(resolve, reject, input, returner);
    }
}



export class SchedulerPerTick {

    tick = 0;
    callbacks: ((arg: any) => any)[]
    resolve: ((value: any) => any) | undefined
    constructor(callbacks: (() => void)[]) {
        this.callbacks = callbacks;
    }
    Run(arg: any) {
        let promise = new Promise<any>((resolve, reject) => {
            this.resolve = resolve;
        });
        system.run(() => this.runPerTick(arg));
        return promise;
    }


    private runPerTick(arg: any) {
        if (this.tick >= this.callbacks.length) {
            this.resolve!(arg);
            return;
        }
        let response = this.callbacks[this.tick](arg);
        this.tick++;
        system.run(() => this.runPerTick(response));
    }


}


export class TickForeach<T> {
    processor: (arg: T) => void
    onEndBlock:((tick:number)=>void)|undefined
    onStartBlock:((tick:number)=>void)|undefined
    iterationsPerTick: number
    startTick:number
    constructor(processor: (arg: T) => void, iterationsPerTick: number,onStartBlock?:(tick:number)=>void, onEndBlock?:(tick:number)=>void) {
        this.iterationsPerTick = iterationsPerTick;
        this.processor = processor
        this.onStartBlock = onStartBlock
        this.onEndBlock = onEndBlock
        this.startTick = 0
    }
    
    async runOnIterable(iterable: Iterable<T>) {
        this.startTick=system.currentTick;
        return new Promise<void>(
            (resolve, reject) => this.runBlock(iterable[Symbol.iterator](), resolve)
        );
    }

    private runBlock(iterator: Iterator<T, any, undefined>, resolve: (value: void) => void) {
        let iter = 0;
        let cursor = iterator.next();
        this.onStartBlock?.(system.currentTick-this.startTick)
        while (!cursor.done) {
            this.processor(cursor.value);
            if (iter >= this.iterationsPerTick) {                
                this.onEndBlock?.(system.currentTick-this.startTick)
                system.run(() => this.runBlock(iterator, resolve)); //Run remaining items on next tick
                return;
            }
            cursor = iterator.next();
            iter++;
        }
        this.onEndBlock?.(system.currentTick-this.startTick);
        resolve();
    }
}
