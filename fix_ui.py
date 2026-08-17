import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Increase height of insights cards
content = content.replace(
    'p-6 flex flex-col justify-between h-40">',
    'p-6 flex flex-col justify-between h-48">'
)

# 2. Side by side charts
# The parent container for charts is currently: <div className="grid grid-cols-1 gap-6">
# But there might be other generic grids like that. Let's look for the comment above it.
old_charts_grid = '''              {/* DOUBLE CHART & MAP SECTION */}
              <div className="grid grid-cols-1 gap-6">

                {/* Visual Chart Card */}
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full">'''

new_charts_grid = '''              {/* DOUBLE CHART & MAP SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Chart Card */}
                <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4 w-full lg:col-span-2">'''

content = content.replace(old_charts_grid, new_charts_grid)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Updated UI")
