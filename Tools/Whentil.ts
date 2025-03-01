/**
 * Whentil contains a When and Until function.
 * @module
 */

type CancelableTask = {
    Cancel: () => void;
    Reset: () => void;
};

/**
 * Until is a function that runs a callback until a condition is met.
 * Accepts a maxRepeats, which is the number of times the callback will be executed.
 */
function Until<T>(
    statement: T | (() => T),
    callback: () => void,
    maxRepeats: number = Infinity
): CancelableTask {
    let isCancelled = false;
    // deno-lint-ignore no-unused-vars
    let hasReset = false;
    let executedCount = 0;

    const resolveStatement = (): T => (typeof statement === 'function' ? (statement as () => T)() : statement);

    const runner = () => {
        if (isCancelled || executedCount >= maxRepeats) return;

        const conditionMet = resolveStatement();
        if (!conditionMet) {
            callback();
            executedCount++;
            setTimeout(runner, 0);
        }
    };

    setTimeout(runner, 0);

    return {
        Cancel() {
            isCancelled = true;
        },
        Reset() {
            if (executedCount >= maxRepeats || isCancelled) {
                isCancelled = false;
                hasReset = true;
                executedCount = 0;
                runner();
            }
        },
    };
}

/**
 * When is a function that runs a callback when a condition is met.
 * Accepts a statement, which can be a function or a value.
 * Accepts a repeater, which is the number of times the callback will be executed.
 */
function When<T>(
    statement: T | (() => T),
    callback: (statement: T) => void,
    repeater: number = 1
): CancelableTask {
    let isCancelled = false;
    // deno-lint-ignore no-unused-vars
    let hasReset = false;
    let executionsRemaining = repeater;

    const resolveStatement = (): T => (typeof statement === 'function' ? (statement as () => T)() : statement);

    const runner = () => {
        if (isCancelled || executionsRemaining <= 0) return;

        try {
            const conditionMet = resolveStatement();
            if (conditionMet) {
                callback(resolveStatement());
                executionsRemaining--;
                if (executionsRemaining > 0) setTimeout(runner, 0);
            } else {
                setTimeout(runner, 0);
            }
        // deno-lint-ignore no-unused-vars
        } catch (error) {
            setTimeout(runner, 0);
        }
    };

    setTimeout(runner, 0);

    return {
        Cancel() {
            isCancelled = true;
        },
        Reset() {
            if (executionsRemaining <= 0 || isCancelled) {
                isCancelled = false;
                hasReset = true;
                executionsRemaining = repeater;
                runner();
            }
        },
    };
}

const Whentil = {
    When,
    Until,
}

export default Whentil;