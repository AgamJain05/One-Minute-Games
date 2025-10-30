# ⚔️ Code Warriors - Advanced Damage System

## 🎯 Time-Based Damage Calculation

### Difficulty Levels & Time Mechanics

#### 🟢 EASY Questions (Expected: 10 seconds)
**Philosophy:** Punishment for being slow on easy questions

- **Fast (< 7s):** 1.0x damage (100%)
- **Normal (7-10s):** 0.9x damage (90%)
- **Slow (> 10s):** 0.5-0.6x damage (50-60%)
- **Wrong Answer:** 0.3x damage (30%)

**Strategy:** Answer quickly but accurately! Taking too long shows weakness.

---

#### 🟡 MEDIUM Questions (Expected: 7 seconds)
**Philosophy:** Balanced rewards for speed

- **Fast (< 4.2s):** 1.3x damage (130%) ⚡
- **Normal (4.2-7s):** 1.0x damage (100%)
- **Slow (> 7s):** 0.6-0.7x damage (60-70%)
- **Wrong Answer:** 0.3x damage (30%)

**Strategy:** Speed matters! Fast answers deal bonus damage.

---

#### 🔴 HARD Questions (Expected: 5 seconds)
**Philosophy:** Massive rewards for mastery

- **Lightning Fast (< 2.5s):** 2.0x damage (200%) 🔥💥 **CRITICAL HIT!**
- **Fast (2.5-4s):** 1.5x damage (150%) ⚡ **POWERFUL!**
- **Normal (4-5s):** 1.2x damage (120%) 💪 **STRONG!**
- **Slow (> 5s):** 0.7-0.8x damage (70-80%)
- **Wrong Answer:** 0.3x damage (30%)

**Strategy:** Master the hardest questions for devastating damage!

---

## 💪 Attack System

### Attack Types

Each character has 3 attacks:

1. **High Damage Quiz Attack**
   - Requires answering a quiz question
   - Damage based on time and difficulty
   - High mana cost

2. **Medium Damage Quiz Attack**
   - Requires answering a quiz question
   - Moderate damage and mana cost

3. **Low Damage Direct Attack**
   - No quiz required
   - Guaranteed damage
   - Low mana cost

---

## 🎮 Gameplay Examples

### Example 1: Easy Question Mastery
```
Question: "What does O(1) mean?" (EASY - 10s expected)
Player answers in 6 seconds (correct)

Base Damage: 25
Time Ratio: 6/10 = 0.6 (< 0.7)
Multiplier: 1.0x
Final Damage: 25

Log: "Algorithm Master used Binary Search! (EASY - 6s) Dealt 25 damage!"
```

### Example 2: Easy Question Fail
```
Question: "What does O(1) mean?" (EASY - 10s expected)
Player answers in 14 seconds (correct)

Base Damage: 25
Time Ratio: 14/10 = 1.4 (> 1.0)
Multiplier: 0.5x (penalty for being too slow)
Final Damage: 12

Log: "Algorithm Master used Binary Search! (EASY - 14s) WEAK... Dealt 12 damage!"
```

### Example 3: Medium Question Speed Bonus
```
Question: "What is the time complexity of binary search?" (MEDIUM - 7s expected)
Player answers in 3 seconds (correct)

Base Damage: 30
Time Ratio: 3/7 = 0.43 (< 0.6)
Multiplier: 1.3x ⚡
Final Damage: 39

Log: "Database Guru used SQL Injection! (MEDIUM - 3s) POWERFUL! Dealt 39 damage!"
```

### Example 4: Hard Question CRITICAL HIT
```
Question: "Space complexity of merge sort?" (HARD - 5s expected)
Player answers in 2 seconds (correct)

Base Damage: 28
Time Ratio: 2/5 = 0.4 (< 0.5)
Multiplier: 2.0x 🔥💥
Final Damage: 56

Log: "Frontend Ninja used DOM Manipulation! (HARD - 2s) CRITICAL HIT! Dealt 56 damage!"
```

### Example 5: Wrong Answer
```
Question: "Quick sort average case complexity?" (MEDIUM - 7s expected)
Player answers incorrectly

Base Damage: 30
Multiplier: 0.3x (wrong answer)
Final Damage: 9

Log: "Algorithm Master used Quick Sort! (MEDIUM - 8s) WEAK... Dealt 9 damage!"
```

---

## 📊 Damage Multiplier Summary

| Difficulty | Speed        | Multiplier | Label          |
|------------|--------------|------------|----------------|
| Easy       | Fast         | 1.0x       | -              |
| Easy       | Normal       | 0.9x       | -              |
| Easy       | Slow         | 0.5-0.6x   | WEAK...        |
| Medium     | Very Fast    | 1.3x       | POWERFUL!      |
| Medium     | Normal       | 1.0x       | -              |
| Medium     | Slow         | 0.6-0.7x   | WEAK...        |
| Hard       | Lightning    | 2.0x       | CRITICAL HIT!  |
| Hard       | Very Fast    | 1.5x       | POWERFUL!      |
| Hard       | Fast         | 1.2x       | STRONG!        |
| Hard       | Slow         | 0.7-0.8x   | -              |
| Any        | Wrong Answer | 0.3x       | WEAK...        |

---

## 🎯 Strategic Implications

### For Easy Questions
- **Don't overthink** - Quick, confident answers
- **Avoid penalties** - Taking too long reduces damage significantly
- **Risk/Reward:** Low risk, but penalties for slowness

### For Medium Questions
- **Balance speed and accuracy** - Good for consistent damage
- **Speed bonus available** - Sub-60% time gives +30% damage
- **Risk/Reward:** Medium risk, good rewards

### For Hard Questions
- **Master the content** - Huge rewards for expertise
- **Critical hits possible** - 2x damage for sub-50% time
- **High risk, high reward** - Wrong answers hurt just as much

### Overall Strategy
1. **Build combos** - Fast correct answers on hard questions
2. **Mix difficulties** - Use easy questions when under pressure
3. **Time management** - Watch the timer, but don't sacrifice accuracy
4. **Psychological warfare** - Landing critical hits demoralizes opponents!

---

## 🏆 Pro Tips

1. **Easy Questions:** Never take more than 10 seconds
2. **Medium Questions:** Aim for sub-6 seconds for bonuses
3. **Hard Questions:** If you know it instantly, go for the critical!
4. **Wrong Answers:** Always deal 30% damage, so guessing isn't terrible
5. **Mana Management:** Low-cost quiz attacks let you attempt more criticals
6. **Visual Feedback:** Green timer = good, Yellow = okay, Red = penalty zone

---

## 🎨 UI Indicators

### Timer Colors
- **Green:** Performing well (< 70% of expected time)
- **Yellow:** Normal speed (70-100% of expected time)
- **Red:** Too slow (> 100% of expected time)

### Difficulty Badges
- 🟢 **EASY:** Green with Shield icon
- 🟡 **MEDIUM:** Yellow with Sword icon
- 🔴 **HARD:** Red with Lightning icon

### Battle Log Colors
- **Red (Critical):** CRITICAL HIT messages
- **Orange (Powerful):** POWERFUL! messages
- **Gray (Weak):** WEAK... messages
- **White:** Normal damage

---

**Master the time-based damage system to dominate in Code Warriors!** ⚔️🔥





