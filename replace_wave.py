import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_wave = '''                  {/* Decorative Wave */}
                  <svg className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-40 translate-x-4 translate-y-4 text-violet-300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M42.7,-64.6C54.4,-57.4,62.3,-43,68.9,-27.7C75.4,-12.3,80.5,3.9,76.5,18.1C72.5,32.4,59.3,44.7,44.9,53.8C30.5,62.9,15.3,68.8,-0.2,69.1C-15.7,69.4,-31.4,64,-44.6,54.4C-57.8,44.7,-68.6,30.8,-74.3,14.6C-80,-1.6,-80.6,-20.1,-72.6,-34.5C-64.6,-48.9,-48.1,-59.1,-32.8,-64.5C-17.5,-70,-8.7,-70.6,2.6,-74.2C14,-77.8,28,-84.3,42.7,-64.6Z" transform="translate(100 100) scale(1.2)" />
                  </svg>'''

new_wave = '''                  {/* Decorative Animated Wave */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem] mix-blend-multiply dark:mix-blend-screen opacity-40">
                    <div className="absolute -bottom-[20%] -right-[10%] w-[120%] h-[120%] origin-bottom-right transition-transform duration-1000 ease-in-out">
                      {/* Base Wave */}
                      <svg className="absolute bottom-0 right-0 w-full h-full text-violet-100 dark:text-violet-900 animate-[pulse_6s_ease-in-out_infinite]" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 100,250 250,350 400,200 L 400,400 Z" />
                      </svg>
                      {/* Secondary Wave */}
                      <svg className="absolute bottom-0 right-0 w-[110%] h-[110%] text-violet-200 dark:text-violet-800 animate-[pulse_8s_ease-in-out_infinite_alternate]" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 150,300 200,200 400,250 L 400,400 Z" />
                      </svg>
                      {/* Tertiary Wave */}
                      <svg className="absolute bottom-0 right-0 w-[90%] h-[90%] text-violet-300 dark:text-violet-700 animate-[pulse_7s_ease-in-out_infinite]" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 0,400 C 120,320 280,280 400,180 L 400,400 Z" opacity="0.5"/>
                      </svg>
                    </div>
                  </div>'''

content = content.replace(old_wave, new_wave)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Updated wave")
