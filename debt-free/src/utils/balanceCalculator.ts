import { Transaction, PersonBalance, Person, GlobalBalance } from '../types/types';

/**
 * SOURCE OF TRUTH for balance calculation
 * net_balance = total(YOU_GAVE/LENT) - total(YOU_GOT/BORROWED)
 * 
 * Interpretation:
 * - net_balance > 0 → I lent more → They owe me → GREEN
 * - net_balance < 0 → I borrowed more → I owe them → RED
 * - net_balance = 0 → Settled
 */
export const calculatePersonBalance = (
    person: Person,
    transactions: Transaction[],
): PersonBalance => {
    let netBalance = 0;

    for (const transaction of transactions) {
        if (transaction.direction === 'YOU_GAVE') {
            // I LENT money, so they owe me (positive)
            netBalance += transaction.amount;
        } else if (transaction.direction === 'YOU_GOT') {
            // I BORROWED money, so I owe them (negative)
            netBalance -= transaction.amount;
        }
    }

    return {
        person,
        netBalance,
        owesMe: netBalance > 0,
        iOwe: netBalance < 0,
        settled: netBalance === 0,
        displayAmount: Math.abs(netBalance),
    };
};

/**
 * Calculate global balance across all people
 * global_net = sum(all person net_balances)
 */
export const calculateGlobalBalance = (
    personBalances: PersonBalance[],
): GlobalBalance => {
    let globalNet = 0;
    let totalLent = 0;
    let totalBorrowed = 0;

    for (const pb of personBalances) {
        globalNet += pb.netBalance;
        if (pb.netBalance > 0) {
            totalLent += pb.netBalance;
        } else if (pb.netBalance < 0) {
            totalBorrowed += Math.abs(pb.netBalance);
        }
    }

    let message: string;
    let color: 'red' | 'green';

    if (globalNet < 0) {
        message = `You are in debt. Pay ₹${Math.abs(globalNet).toFixed(2)} to be debt-free`;
        color = 'red';
    } else if (globalNet === 0) {
        message = 'You are free of debt';
        color = 'green';
    } else {
        message = `You will receive ₹${globalNet.toFixed(2)}`;
        color = 'green';
    }

    return {
        globalNet,
        totalLent,
        totalBorrowed,
        message,
        color,
    };
};
