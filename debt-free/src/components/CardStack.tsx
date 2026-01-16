import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { CreditCard } from './CreditCard';
import { Card } from '../types/types';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.15;

interface CardStackProps {
    cards: Card[];
    onTopCardChange: (card: Card) => void;
}

export const CardStack: React.FC<CardStackProps> = ({ cards, onTopCardChange }) => {
    const [stack, setStack] = useState<Card[]>([]);
    const position = useRef(new Animated.ValueXY()).current;
    const isSwiping = useRef(false);

    React.useEffect(() => {
        // Initialize or update stack when cards prop changes
        // But keep the current relative order if possible, or just reset if length changed
        setStack(cards);
    }, [cards.length]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
            },
            onPanResponderGrant: () => {
                isSwiping.current = true;
            },
            onPanResponderMove: Animated.event(
                [null, { dx: position.x, dy: position.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (evt, gestureState) => {
                if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
                    forceSwipe(gestureState.dx > 0 ? 'right' : 'left');
                } else {
                    resetPosition();
                }
                isSwiping.current = false;
            },
            onPanResponderTerminate: () => {
                resetPosition();
                isSwiping.current = false;
            },
        })
    ).current;

    const forceSwipe = (direction: 'left' | 'right') => {
        const x = direction === 'right' ? width * 1.5 : -width * 1.5;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: 250,
            useNativeDriver: false,
        }).start(() => onSwipeComplete());
    };

    const onSwipeComplete = () => {
        setStack(currentStack => {
            if (currentStack.length === 0) return [];
            const newStack = [...currentStack];
            const swipedCard = newStack.shift();
            if (swipedCard) {
                newStack.push(swipedCard);
            }
            // Notify parent about the new top card
            if (newStack.length > 0) {
                onTopCardChange(newStack[0]);
            }
            return newStack;
        });
        position.setValue({ x: 0, y: 0 });
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
        }).start();
    };

    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-width * 1.5, 0, width * 1.5],
            outputRange: ['-120deg', '0deg', '120deg'],
        });

        return {
            transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate }
            ],
        };
    };

    const renderCards = () => {
        if (stack.length === 0) return null;

        const topCard = stack[0];
        const backgroundCards = stack.slice(1, 3);

        return (
            <View style={styles.stackInner}>
                {backgroundCards.reverse().map((card, index) => {
                    const displayIndex = backgroundCards.length - index; // 1 or 2
                    return (
                        <View
                            key={`bg-${card.id}`}
                            style={[
                                styles.cardWrapper,
                                {
                                    top: 10 * displayIndex,
                                    zIndex: 100 - displayIndex,
                                    opacity: 1 - 0.2 * displayIndex,
                                    transform: [{ scale: 1 - 0.05 * displayIndex }],
                                },
                            ]}
                        >
                            <CreditCard card={card} />
                        </View>
                    );
                })}
                <Animated.View
                    key={`top-${topCard.id}`}
                    style={[
                        getCardStyle(),
                        styles.cardWrapper,
                        {
                            top: 0,
                            zIndex: 101,
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <CreditCard card={topCard} />
                </Animated.View>
            </View>
        );
    };

    return <View style={styles.container}>{renderCards()}</View>;
};

const styles = StyleSheet.create({
    container: {
        height: 500,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardWrapper: {
        position: 'absolute',
        width: 280,
    },
    stackInner: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
