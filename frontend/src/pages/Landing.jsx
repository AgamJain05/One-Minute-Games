import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#102122] text-white font-sans overflow-x-hidden selection:bg-primary selection:text-[#102122]">
      {/* Floating Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px]" 
             style={{ maskImage: 'linear-gradient(to bottom, transparent, 10%, black, 90%, transparent)' }}></div>
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-[#0ddff2]/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#102122]/80 backdrop-blur-md">
          <div className="flex justify-center w-full">
            <div className="flex items-center justify-between w-full max-w-7xl px-4 md:px-10 py-4">
              <div className="flex items-center gap-3 text-white">
                <div className="size-8 flex items-center justify-center bg-[#0ddff2]/10 rounded-lg text-[#0ddff2] border border-[#0ddff2]/30">
                  <span className="text-xl">🧪</span>
                </div>
                <h2 className="text-white text-xl font-bold leading-tight tracking-tight">DevMinute</h2>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a className="text-slate-300 hover:text-[#0ddff2] transition-colors text-sm font-medium" href="#features">Features</a>
                <a className="text-slate-300 hover:text-[#0ddff2] transition-colors text-sm font-medium" href="#leaderboard">Leaderboard</a>
                <a className="text-slate-300 hover:text-[#0ddff2] transition-colors text-sm font-medium" href="#pricing">Pricing</a>
              </div>
              <Link 
                to="/register"
                className="hidden md:flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#0ddff2] hover:bg-[#0ab5c2] transition-colors text-[#102122] text-sm font-bold shadow-[0_0_15px_rgba(13,223,242,0.3)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-12 md:py-24 px-4 md:px-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6 text-left max-w-xl mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ddff2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ddff2]"></span>
                </span>
                <span className="text-xs font-mono text-[#0ddff2] uppercase tracking-wider">v2.0 Live Now</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
                Master Algorithms in <span className="bg-gradient-to-r from-[#0ddff2] to-purple-500 bg-clip-text text-transparent">60 Seconds</span>
              </h1>
              
              <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-lg">
                The gamified micro-coding platform for busy developers. Stop grinding LeetCode for hours. Level up your skills, one minute at a time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link 
                  to="/register"
                  className="flex items-center justify-center h-12 px-8 rounded-lg bg-[#0ddff2] hover:bg-[#0ab5c2] text-[#102122] font-bold text-base transition-all shadow-[0_0_20px_rgba(13,223,242,0.4)] hover:shadow-[0_0_30px_rgba(13,223,242,0.6)]"
                >
                  Start Coding Now
                </Link>
                <Link 
                  to="/login"
                  className="flex items-center justify-center h-12 px-8 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
              </div>
              
              <div className="flex items-center gap-4 mt-6 text-sm text-slate-500 font-mono">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#102122] bg-gradient-to-br from-cyan-400 to-blue-500"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#102122] bg-gradient-to-br from-purple-400 to-pink-500"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#102122] bg-gradient-to-br from-green-400 to-emerald-500"></div>
                </div>
                <p>Join 10,000+ devs today</p>
              </div>
            </motion.div>

            {/* Right: Terminal UI */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-lg mx-auto lg:mx-0 group"
            >
              {/* Glow effect behind terminal */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0ddff2] to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative rounded-xl bg-[#1e1e2e] border border-[#2e2e3e] shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-[#2e2e3e]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-500">challenge_042.js</div>
                  <div className="w-8"></div>
                </div>
                
                {/* Terminal Content */}
                <div className="p-6 font-mono text-sm md:text-base leading-relaxed text-slate-300 relative">
                  {/* Countdown Overlay */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full animate-pulse">
                    <span className="text-red-400">⏱️</span>
                    <span className="text-red-400 font-bold">00:48</span>
                  </div>
                  
                  <div className="text-[#c678dd] italic">// Challenge: Reverse a string without built-in methods</div>
                  <br />
                  <div><span className="text-[#c678dd]">function</span> <span className="text-[#61afef]">reverseString</span><span className="text-[#abb2bf]">(</span><span className="text-[#e06c75]">str</span><span className="text-[#abb2bf]">) {'{'}</span></div>
                  <div className="pl-4"><span className="text-[#c678dd]">let</span> <span className="text-[#e06c75]">reversed</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#98c379]">""</span><span className="text-[#abb2bf]">;</span></div>
                  <div className="pl-4"><span className="text-[#c678dd]">for</span> <span className="text-[#abb2bf]">(</span><span className="text-[#c678dd]">let</span> <span className="text-[#e06c75]">i</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#e06c75]">str</span><span className="text-[#abb2bf]">.</span><span className="text-[#e06c75]">length</span> <span className="text-[#56b6c2]">-</span> <span className="text-[#d19a66]">1</span><span className="text-[#abb2bf]">;</span> <span className="text-[#e06c75]">i</span> <span className="text-[#56b6c2]">&gt;=</span> <span className="text-[#d19a66]">0</span><span className="text-[#abb2bf]">;</span> <span className="text-[#e06c75]">i</span><span className="text-[#56b6c2]">--</span><span className="text-[#abb2bf]">) {'{'}</span></div>
                  <div className="pl-8"><span className="text-[#e06c75]">reversed</span> <span className="text-[#56b6c2]">+=</span> <span className="text-[#e06c75]">str</span><span className="text-[#abb2bf]">[</span><span className="text-[#e06c75]">i</span><span className="text-[#abb2bf]">];</span><span className="border-l-2 border-[#0ddff2] animate-pulse h-4 inline-block align-middle ml-0.5"></span></div>
                  <div className="pl-4"><span className="text-[#abb2bf]">{'}'}</span></div>
                  <div className="pl-4"><span className="text-[#c678dd]">return</span> <span className="text-[#e06c75]">reversed</span><span className="text-[#abb2bf]">;</span></div>
                  <div><span className="text-[#abb2bf]">{'}'}</span></div>
                </div>
                
                {/* Terminal Footer */}
                <div className="bg-[#181825] px-4 py-2 flex justify-between items-center text-xs font-mono border-t border-[#2e2e3e]">
                  <div className="text-[#0ddff2] flex items-center gap-1">
                    <span>✓</span>
                    <span>2/3 Tests Passing</span>
                  </div>
                  <div className="text-slate-500">Ln 5, Col 24</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 relative overflow-hidden" id="features">
          <div className="absolute right-0 top-1/4 w-1/3 h-1/3 bg-[#0ddff2]/5 rounded-full blur-[100px]"></div>
          
          <div className="px-4 md:px-10 max-w-7xl mx-auto w-full relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Code Smarter, Not Harder</h2>
              <p className="text-slate-400 max-w-2xl">Traditional coding prep is boring and time-consuming. DevMinute is built for the dopamine-driven developer.</p>
            </motion.div>

            {/* Comparison Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch mb-20">
              {/* Traditional Way */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-8 flex flex-col gap-6 opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-400 text-3xl">⏳</span>
                  <h3 className="text-2xl font-bold text-slate-300">The Old Way</h3>
                </div>
                <ul className="flex flex-col gap-4">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400">✗</span>
                    <span className="text-slate-400">Hours of theoretical reading</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400">✗</span>
                    <span className="text-slate-400">Slow, delayed feedback loops</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400">✗</span>
                    <span className="text-slate-400">Isolated learning experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400">✗</span>
                    <span className="text-slate-400">Generic "Hello World" examples</span>
                  </li>
                </ul>
              </motion.div>

              {/* DevMinute Way */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl p-8 flex flex-col gap-6 relative bg-white/[0.03] backdrop-blur-md border border-[#0ddff2]/20"
              >
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[#0ddff2] text-4xl opacity-20">🚀</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#0ddff2] text-3xl">⚡</span>
                  <h3 className="text-2xl font-bold text-white">DevMinute</h3>
                </div>
                <ul className="flex flex-col gap-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ddff2]">✓</span>
                    <span className="text-white">60-second micro-challenges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ddff2]">✓</span>
                    <span className="text-white">Real-time unit test validation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ddff2]">✓</span>
                    <span className="text-white">Global leaderboards &amp; PvP mode</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ddff2]">✓</span>
                    <span className="text-white">Production-ready patterns</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🧠', title: 'Daily Streaks', desc: 'Build a habit that sticks. Keep your streak alive to earn exclusive profile badges and dark mode themes.' },
                { icon: '💻', title: 'Instant Feedback', desc: 'No more waiting. Our engine runs your code against 100+ edge cases in milliseconds.' },
                { icon: '📈', title: 'Career Growth', desc: 'Visual metrics for your resume. Show employers your actual problem-solving speed and accuracy.' },
              ].map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl p-6 hover:bg-white/5 transition-all group cursor-default bg-white/[0.03] backdrop-blur-md border border-[#0ddff2]/20"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0ddff2]/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-2xl">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="py-16 bg-[#0f1115] border-y border-white/5" id="leaderboard">
          <div className="px-4 md:px-10 max-w-4xl mx-auto w-full">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Top Coders this Week</h2>
                <p className="text-slate-400">Compete with the best. Can you reach the top 10?</p>
              </div>
              <button className="text-[#0ddff2] hover:text-white transition-colors text-sm font-bold flex items-center gap-1">
                View Full Board <span>→</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Rank 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-[#1b2627] border border-[#0ddff2]/30 p-4 rounded-xl relative overflow-hidden group hover:border-[#0ddff2] transition-colors"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0ddff2] to-purple-500"></div>
                <div className="flex-shrink-0 font-bold text-xl text-[#0ddff2] w-8">01</div>
                <div className="w-12 h-12 rounded-full border-2 border-[#0ddff2] bg-gradient-to-br from-cyan-400 to-blue-500"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold truncate">@syntax_wizard</h3>
                    <span className="text-yellow-400 text-sm">✓</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 max-w-[200px]">
                    <div className="bg-[#0ddff2] h-1.5 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-mono font-bold">12,450 XP</div>
                  <div className="text-xs text-slate-500">Diamond League</div>
                </div>
              </motion.div>

              {/* Rank 2 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 bg-[#1b2627] border border-white/5 p-4 rounded-xl hover:border-white/20 transition-colors"
              >
                <div className="flex-shrink-0 font-bold text-xl text-slate-400 w-8">02</div>
                <div className="w-12 h-12 rounded-full border border-slate-600 bg-gradient-to-br from-purple-400 to-pink-500"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold truncate">@bug_hunter</h3>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 max-w-[200px]">
                    <div className="bg-[#0ddff2]/70 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-mono font-bold">10,200 XP</div>
                  <div className="text-xs text-slate-500">Platinum League</div>
                </div>
              </motion.div>

              {/* Rank 3 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 bg-[#1b2627] border border-white/5 p-4 rounded-xl hover:border-white/20 transition-colors"
              >
                <div className="flex-shrink-0 font-bold text-xl text-slate-400 w-8">03</div>
                <div className="w-12 h-12 rounded-full border border-slate-600 bg-gradient-to-br from-green-400 to-emerald-500"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold truncate">@null_pointer</h3>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 max-w-[200px]">
                    <div className="bg-[#0ddff2]/50 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-mono font-bold">9,850 XP</div>
                  <div className="text-xs text-slate-500">Platinum League</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0ddff2]/5 pointer-events-none"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to <span className="text-[#0ddff2]">Level Up?</span></h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">Join thousands of developers who are mastering algorithms and landing their dream jobs with DevMinute.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register"
                className="flex items-center justify-center h-14 px-8 rounded-xl bg-[#0ddff2] hover:bg-[#0ab5c2] text-[#102122] text-lg font-bold shadow-[0_0_20px_rgba(13,223,242,0.4)] transition-all transform hover:-translate-y-1"
              >
                Start Your Free Challenge
              </Link>
              <button className="flex items-center justify-center h-14 px-8 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-white/10 text-white text-lg font-bold transition-all">
                View Enterprise Plans
              </button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#0f1115] py-12 px-4 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <span className="text-[#0ddff2]">🧪</span>
              <span className="font-bold text-lg">DevMinute</span>
            </div>
            <div className="flex gap-8 text-slate-400 text-sm">
              <a className="hover:text-[#0ddff2] transition-colors" href="#">Privacy</a>
              <a className="hover:text-[#0ddff2] transition-colors" href="#">Terms</a>
              <a className="hover:text-[#0ddff2] transition-colors" href="#">Twitter</a>
              <a className="hover:text-[#0ddff2] transition-colors" href="#">GitHub</a>
            </div>
            <div className="text-slate-600 text-sm">
              © 2026 DevMinute Inc.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
