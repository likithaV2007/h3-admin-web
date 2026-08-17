import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_chart_logic = '''                    const costPoints = monthlyCosts.map((val, i) => {
                      const x = 30 + (i * 48); // 12 points spanning from 30 to 558
                      const y = chartYStart - (Math.min(val, maxChartValue) / maxChartValue) * chartHeight;
                      return { x, y };
                    });

                    const costPolyline = costPoints.map(p => `${p.x},${p.y}`).join(' ');
                    const lastX = costPoints.length > 0 ? costPoints[costPoints.length - 1].x : 558;
                    const costPolygon = `30,170 ${costPolyline} ${lastX},170`;

                    return (
                      <div className="relative pt-4 h-52 w-full mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 600 190" preserveAspectRatio="none">
                          {/* Grid lines */}
                          <defs>
                            <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />
                          <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4" />

                          {/* Chart Areas */}
                          <polygon points={costPolygon} fill="url(#costsGrad)" />

                          {/* Chart Lines */}
                          <polyline points={costPolyline} fill="none" stroke="#8b5cf6" strokeWidth="3" className="drop-shadow-sm" />'''

new_chart_logic = '''                    const costPoints = monthlyCosts.map((val, i) => {
                      const x = 30 + (i * 48); // 12 points spanning from 30 to 558
                      const y = chartYStart - (Math.min(val, maxChartValue) / maxChartValue) * chartHeight;
                      return { x, y };
                    });

                    let costPath = '';
                    if (costPoints.length > 0) {
                      costPath = `M ${costPoints[0].x},${costPoints[0].y}`;
                      for (let i = 0; i < costPoints.length - 1; i++) {
                        const xMid = (costPoints[i].x + costPoints[i + 1].x) / 2;
                        costPath += ` C ${xMid},${costPoints[i].y} ${xMid},${costPoints[i + 1].y} ${costPoints[i + 1].x},${costPoints[i + 1].y}`;
                      }
                    }

                    const lastX = costPoints.length > 0 ? costPoints[costPoints.length - 1].x : 558;
                    const firstX = costPoints.length > 0 ? costPoints[0].x : 30;
                    const costPolygonPath = `${costPath} L ${lastX},170 L ${firstX},170 Z`;

                    return (
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
                          <path d={costPath} fill="none" stroke="#8b5cf6" strokeWidth="3" className="drop-shadow-sm" />'''

content = content.replace(old_chart_logic, new_chart_logic)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("done")
