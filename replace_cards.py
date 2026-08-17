import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Define the new wave SVG
wave_svg = '''
                  {/* Decorative Wave */}
                  <svg className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-40 translate-x-4 translate-y-4 text-violet-300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M42.7,-64.6C54.4,-57.4,62.3,-43,68.9,-27.7C75.4,-12.3,80.5,3.9,76.5,18.1C72.5,32.4,59.3,44.7,44.9,53.8C30.5,62.9,15.3,68.8,-0.2,69.1C-15.7,69.4,-31.4,64,-44.6,54.4C-57.8,44.7,-68.6,30.8,-74.3,14.6C-80,-1.6,-80.6,-20.1,-72.6,-34.5C-64.6,-48.9,-48.1,-59.1,-32.8,-64.5C-17.5,-70,-8.7,-70.6,2.6,-74.2C14,-77.8,28,-84.3,42.7,-64.6Z" transform="translate(100 100) scale(1.2)" />
                  </svg>
'''

# We will replace the entire METRIC CARDS block.
# Let's find the start and end of it.
start_marker = "{/* ANALYTICS METRIC CARDS */}"
end_marker = "{/* DOUBLE CHART & MAP SECTION */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_metrics = f'''{{/* ANALYTICS METRIC CARDS */}}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {{/* Metric 1 */}}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-40">
                  {wave_svg}
                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner shrink-0">
                      <Users size={26} strokeWidth={{2}} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        Total Enrolled
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#1e293b] dark:text-white tracking-tight">
                        {{dashboardStats?.total_students ?? students.length}}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full text-[11px] font-bold">
                      <ArrowUp size={{12}} strokeWidth={{3}} />
                      12%
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                      vs last semester
                    </span>
                  </div>
                </div>

                {{/* Metric 2 */}}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-40">
                  {wave_svg}
                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner shrink-0">
                      {{activeRole === 'Student' ? <Calendar size={{26}} strokeWidth={{2}} /> : <ShieldCheck size={{26}} strokeWidth={{2}} />}}
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        {{activeRole === 'Student' ? 'My Attendance' : 'Total Admins'}}
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#1e293b] dark:text-white tracking-tight">
                        {{activeRole === 'Student' ? '94.5%' : (dashboardStats?.total_admins ?? adminCount)}}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    {{activeRole === 'Student' ? (
                      <>
                        <span className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <ArrowUp size={{12}} strokeWidth={{3}} />
                          Target 90%
                        </span>
                        <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">met successfully</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          Active
                        </span>
                        <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Managing operations</span>
                      </>
                    )}}
                  </div>
                </div>

                {{/* Metric 3 */}}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-40">
                  {wave_svg}
                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner shrink-0">
                      <Heart size={{26}} strokeWidth={{2}} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        {{activeRole === 'Student' ? 'Sponsor' : 'Total Donors'}}
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#1e293b] dark:text-white tracking-tight">
                        {{activeRole === 'Student' ? 'Hope3 Foundation' : (dashboardStats?.total_donors ?? donors.length)}}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    {{activeRole === 'Student' ? (
                      <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Full tuition & hostel covered</span>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          Active
                        </span>
                        <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Sponsoring education</span>
                      </>
                    )}}
                  </div>
                </div>

                {{/* Metric 4 */}}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col justify-between h-40">
                  {wave_svg}
                  
                  <div className="flex items-start gap-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner shrink-0">
                      <MapPin size={{26}} strokeWidth={{2}} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                        Out of Fence
                      </h4>
                      <div className="text-[2.25rem] leading-none font-extrabold mt-1 text-[#1e293b] dark:text-white tracking-tight">
                        {{students.filter(s => s.location.status === 'Out of Bounds').length}}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 z-10">
                    <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                      Requires urgent review
                    </span>
                  </div>
                </div>

              </div>

              '''
    
    new_content = content[:start_idx] + new_metrics + content[end_idx:]
    with open("src/App.tsx", "w") as f:
        f.write(new_content)
    print("Replaced metrics")
else:
    print("Could not find markers")
