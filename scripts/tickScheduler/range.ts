
export function* range(n: number): Iterable<number> {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}
