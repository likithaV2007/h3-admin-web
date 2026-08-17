import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_return_block = '''                    return (
                      <div className="relative pt-4 h-64 w-full mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                          {/* Grid lines */}
                          <defs>
                            <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />

                          {/* Chart Areas */}
                          <path d={costPolygonPath} fill="url(#costsGrad)" />

                          {/* Chart Lines */}
                          <path d={costPath} fill="none" stroke="#8b5cf6" strokeWidth="3" className="drop-shadow-sm" />

                          {/* Data Points */}
                          {costPoints.map((p, i) => (
                            <circle key={`c-${i}`} cx={p.x} cy={p.y} r="4" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                          ))}

                          {/* X Axis line */}
                          <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />

                          {/* X Labels */}
                          {monthLabels.map((label, idx) => (
                            <text key={idx} x={30 + (idx * 48)} y="192" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                              {label}
                            </text>
                          ))}

                          {/* Y Labels */}
                          <text x="30" y="24" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">{formatK(maxChartValue)}</text>
                          <text x="30" y="74" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">{formatK(yStep * 2)}</text>
                          <text x="30" y="124" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">{formatK(yStep)}</text>
                          <text x="30" y="174" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">0</text>
                        </svg>
                      </div>
                    );'''

new_return_block = '''                    return (
                      <div className="relative pt-4 h-64 w-full mx-auto flex flex-col">
                        <div className="relative flex-1 w-full">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                            {/* Grid lines */}
                            <defs>
                              <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                            <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                            <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                            <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />

                            {/* Chart Areas */}
                            <path d={costPolygonPath} fill="url(#costsGrad)" />

                            {/* Chart Lines */}
                            <path d={costPath} fill="none" stroke="#8b5cf6" strokeWidth="3" vectorEffect="non-scaling-stroke" className="drop-shadow-sm" />

                            {/* Data Points */}
                            {costPoints.map((p, i) => (
                              <circle key={`c-${i}`} cx={p.x} cy={p.y} r="4" fill="#8b5cf6" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            ))}

                            {/* X Axis line */}
                            <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                          </svg>

                          {/* Y Labels as HTML (prevent stretch) */}
                          <div className="absolute inset-y-0 left-0 w-10 flex flex-col justify-between py-[12px] text-xs font-bold text-slate-800 dark:text-slate-200 pointer-events-none">
                            <span className="text-right pr-2">{formatK(maxChartValue)}</span>
                            <span className="text-right pr-2">{formatK(yStep * 2)}</span>
                            <span className="text-right pr-2">{formatK(yStep)}</span>
                            <span className="text-right pr-2">0</span>
                          </div>
                        </div>

                        {/* X Labels as HTML (prevent stretch) */}
                        <div className="relative w-full h-8 flex items-center mt-2 px-10">
                          {monthLabels.map((label, idx) => (
                            <div key={idx} className="flex-1 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    );'''

if old_return_block in content:
    content = content.replace(old_return_block, new_return_block)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Could not find old block")
