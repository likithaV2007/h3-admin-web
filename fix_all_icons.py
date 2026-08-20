with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the distinct colors with the light theme color
old_colors = """${catLower.includes('snack') || catLower.includes('food') ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                      catLower.includes('sport') ? 'bg-orange-50 text-orange-500 border-orange-100' :
                                        catLower.includes('travel') ? 'bg-blue-50 text-blue-500 border-blue-100' :
                                          catLower.includes('groc') ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                            catLower.includes('med') ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                              'bg-[#cbb4d4]/10 text-[#cbb4d4] border-[#cbb4d4]/20'
                                      }"""

new_colors = """bg-[#cbb4d4]/10 text-[#cbb4d4] border-[#cbb4d4]/20"""
content = content.replace(old_colors, new_colors)

# Also fix the category tags (like SNACKS) which also use distinct colors
old_tags = """${catLower.includes('snack') || catLower.includes('food') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    catLower.includes('sport') ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                      catLower.includes('travel') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        catLower.includes('groc') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                          catLower.includes('med') ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                            catLower.includes('station') ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                              'bg-slate-100 text-slate-600 border-slate-200'
                                    }"""
new_tags = """bg-[#cbb4d4]/10 text-[#cbb4d4] border-[#cbb4d4]/20"""
content = content.replace(old_tags, new_tags)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
