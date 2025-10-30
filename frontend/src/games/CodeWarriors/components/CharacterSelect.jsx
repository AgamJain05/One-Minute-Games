import { motion } from 'framer-motion';

export default function CharacterSelect({ characters, players, onSelect, onStart }) {
  const canStart = players.player1 && players.player2;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Player 1 Selection */}
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">Player 1</h2>
          <div className="space-y-4">
            {characters.map(char => (
              <motion.button
                key={char.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect('player1', char)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  players.player1?.id === char.id
                    ? 'bg-primary border-primary'
                    : 'bg-dark-bg border-gray-700 hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{char.avatar}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{char.name}</h3>
                    <p className="text-sm text-gray-400">{char.attacks.length} attacks</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Player 2 Selection */}
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6 text-secondary">Player 2</h2>
          <div className="space-y-4">
            {characters.map(char => (
              <motion.button
                key={char.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect('player2', char)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  players.player2?.id === char.id
                    ? 'bg-secondary border-secondary'
                    : 'bg-dark-bg border-gray-700 hover:border-secondary'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{char.avatar}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{char.name}</h3>
                    <p className="text-sm text-gray-400">{char.attacks.length} attacks</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {canStart && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onStart}
          className="btn-primary w-full text-2xl py-6"
        >
          ⚔️ Start Battle!
        </motion.button>
      )}
    </div>
  );
}





