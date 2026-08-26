import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add ProfileAvatar
profile_avatar_code = """
const ProfileAvatar = ({ url, name, className, fallbackClassName }: { url?: string | null, name?: string | null, className: string, fallbackClassName: string }) => {
  const [error, setError] = React.useState(false);
  const parsedUrl = getDriveImageUrl(url);

  if (!parsedUrl || error) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
      <div className={fallbackClassName}>
        {initial}
      </div>
    );
  }

  return (
    <img referrerPolicy="no-referrer" 
      src={parsedUrl} 
      alt={name || "Profile"} 
      className={className} 
      onError={() => setError(true)}
    />
  );
};
"""

content = content.replace(
"""const AchievementImage = ({ url }: { url: string }) => {
  const [error, setError] = useState(false);
  const parsedUrl = getDriveImageUrl(url);

  if (!parsedUrl || error) {
    return (
      <div className="w-12 h-12 rounded-lg bg-[#cbb4d4]/20 flex items-center justify-center shrink-0">
        <span className="text-xl">🏆</span>
      </div>
    );
  }

  return (
    <img 
      src={parsedUrl} 
      alt="Badge" 
      className="w-12 h-12 object-contain rounded-lg shrink-0" 
      onError={() => setError(true)}
    />
  );
};""",
profile_avatar_code + """
const AchievementImage = ({ url, className = "w-12 h-12 object-contain rounded-lg shrink-0", fallbackClassName = "w-12 h-12 rounded-lg bg-[#cbb4d4]/20 flex items-center justify-center shrink-0" }: { url: string, className?: string, fallbackClassName?: string }) => {
  const [error, setError] = useState(false);
  const parsedUrl = getDriveImageUrl(url);

  if (!parsedUrl || error) {
    return (
      <div className={fallbackClassName}>
        <span className="text-4xl drop-shadow-sm">🏆</span>
      </div>
    );
  }

  return (
    <img referrerPolicy="no-referrer" 
      src={parsedUrl} 
      alt="Badge" 
      className={className} 
      onError={() => setError(true)}
    />
  );
};"""
)

# 2. Fix Achievements layout
content = content.replace(
"""                    {/* PROFILE TAB: ACHIEVEMENTS */}
                    {profileTab === 'Achievements' && (
                      <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm">Student Achievements</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {studentAchievements.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 col-span-full text-center">No achievements recorded yet.</p>
                          ) : (
                            studentAchievements.map(ach => (
                              <div key={ach.id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex gap-4 items-start">
                                <AchievementImage url={ach.badge_image_url} />
                                <div className="space-y-1">
                                  <h5 className="font-bold text-sm leading-tight text-slate-900 dark:text-white">{ach.title}</h5>
                                  <p className="text-xs text-slate-500 line-clamp-2">{ach.description}</p>
                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-[10px] text-slate-400 font-mono">{ach.date}</span>
                                    {ach.status && ach.status !== 'string' && (
                                      <span className="text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">{ach.status}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}""",
"""                    {/* PROFILE TAB: ACHIEVEMENTS */}
                    {profileTab === 'Achievements' && (
                      <div className="space-y-4 w-full">
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3 mb-6">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                          Student Achievements
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {studentAchievements.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 col-span-full text-center">No achievements recorded yet.</p>
                          ) : (
                            studentAchievements.map(ach => (
                              <div key={ach.id} className="glass-panel rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-[#cbb4d4]/20 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                  <AchievementImage 
                                    url={ach.photo_drive_link || ach.badge_image_url} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    fallbackClassName="w-full h-full bg-[#cbb4d4]/10 flex items-center justify-center shrink-0" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">{ach.date}</span>
                                    {ach.status && ach.status !== 'string' && (
                                      <span className="text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold bg-[#cbb4d4]/10 text-slate-800 dark:text-white rounded-full border border-[#cbb4d4]/30">{ach.status}</span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-base leading-tight text-slate-900 dark:text-white mb-2">{ach.title}</h5>
                                  <p className="text-xs text-slate-500 line-clamp-2">{ach.description}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}"""
)


# 3. Fix Academic Details layout
content = content.replace(
"""                    {/* PROFILE TAB: ACADEMIC DETAILS */}
                    {profileTab === 'Academic Details' && (
                      <div className="glass-panel rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm">Semesters & Academic Records</h4>
                        </div>
                        <div className="space-y-4">
                          {studentSemesters.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No academic records found.</p>
                          ) : (
                            studentSemesters.map(sem => (
                              <div key={sem.semester_id} className="p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-sm">{sem.semester_name}</h5>
                                    <span className="text-[10px] text-slate-500 font-mono">Year: {sem.academic_year}</span>
                                  </div>
                                  {sem.is_active === 1 && (
                                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-700">Active</span>
                                  )}
                                </div>
                                {sem.subject && sem.subject.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {sem.subject.map((sub: string, idx: number) => (
                                      <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                                        {sub}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {sem.marksheetImageLink && sem.marksheetImageLink !== 'string' && (
                                  <div className="pt-2">
                                    <a href={sem.marksheetImageLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                                      📄 View Marksheet
                                    </a>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}""",
"""                    {/* PROFILE TAB: ACADEMIC DETAILS */}
                    {profileTab === 'Academic Details' && (
                      <div className="space-y-4 w-full">
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 relative pl-3 mb-6">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-[#20002c] to-[#cbb4d4]"></div>
                          Semesters & Academic Records
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {studentSemesters.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 col-span-full text-center">No academic records found.</p>
                          ) : (
                            studentSemesters.map(sem => (
                              <div key={sem.semester_id} className="glass-panel rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-[#cbb4d4]/20 hover:-translate-y-1 transition-all duration-300 flex flex-col p-5">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h5 className="font-bold text-base leading-tight text-slate-900 dark:text-white mb-1">{sem.semester_name}</h5>
                                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Year: {sem.academic_year}</span>
                                  </div>
                                  {sem.is_active === 1 && (
                                    <span className="text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold bg-[#cbb4d4]/10 text-slate-800 dark:text-white rounded-full border border-[#cbb4d4]/30">Active</span>
                                  )}
                                </div>
                                {sem.subject && sem.subject.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {sem.subject.map((sub: string, idx: number) => (
                                      <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                        {sub}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                  {sem.marksheetImageLink && sem.marksheetImageLink !== 'string' ? (
                                    <a href={sem.marksheetImageLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#cbb4d4] hover:text-[#20002c] dark:hover:text-white hover:underline inline-flex items-center gap-1.5 transition-colors">
                                      📄 View Marksheet
                                    </a>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-400 inline-flex items-center gap-1.5">
                                      📄 No Marksheet
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}"""
)

# 4. Fix Buttons
content = content.replace("bg-green-600 hover:bg-green-700 text-slate-900", "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800")
content = content.replace("bg-green-600 hover:bg-green-750 text-slate-900", "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800")
content = content.replace("bg-red-600 hover:bg-red-700 text-slate-900", "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800")
content = content.replace("bg-red-600 hover:bg-red-750 text-slate-900", "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800")

# 5. Fix Avatars in tables using exact string replacements for safety.
content = content.replace(
"""                              {student.avatar || student.profile_photo_link ? (
                                <img src={student.avatar || student.profile_photo_link} alt={student.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0">
                                  {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                                </div>
                              )}""",
"""                              <ProfileAvatar url={student.avatar || student.profile_photo_link} name={student.name || (student as any).student_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0" />"""
)

content = content.replace(
"""                      {selectedStudent.avatar || selectedStudent.profile_photo_link || selectedStudent.profilePhotoUrl ? (
                        <img src={selectedStudent.avatar || selectedStudent.profile_photo_link || selectedStudent.profilePhotoUrl} alt={selectedStudent.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md shrink-0" />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md bg-[#cbb4d4]/10 text-slate-800 dark:text-[#cbb4d4] font-black text-3xl shrink-0">
                          {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}""",
"""                      <ProfileAvatar url={selectedStudent.avatar || selectedStudent.profile_photo_link || selectedStudent.profilePhotoUrl} name={selectedStudent.name || (selectedStudent as any).student_name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md shrink-0" fallbackClassName="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md bg-[#cbb4d4]/10 text-slate-800 dark:text-[#cbb4d4] font-black text-3xl shrink-0" />"""
)

content = content.replace(
"""                            {par.profile_photo_link || par.avatar ? (
                              <img src={par.profile_photo_link || par.avatar} alt={par.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0">
                                {par.name ? par.name.charAt(0).toUpperCase() : '?'}
                              </div>
                            )}""",
"""                            <ProfileAvatar url={par.profile_photo_link || par.avatar} name={par.name || (par as any).parent_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0" />"""
)

content = content.replace(
"""                            {vol.profile_photo_link || vol.avatar ? (
                              <img src={vol.profile_photo_link || vol.avatar} alt={vol.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0">
                                {vol.name ? vol.name.charAt(0).toUpperCase() : '?'}
                              </div>
                            )}""",
"""                            <ProfileAvatar url={vol.profile_photo_link || vol.avatar} name={vol.name || (vol as any).volunteer_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0" />"""
)

content = content.replace(
"""                            {donor.profile_photo_link || donor.avatar ? (
                              <img src={donor.profile_photo_link || donor.avatar} alt={donor.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0">
                                {donor.name ? donor.name.charAt(0).toUpperCase() : '?'}
                              </div>
                            )}""",
"""                            <ProfileAvatar url={donor.profile_photo_link || donor.avatar} name={donor.name || (donor as any).donor_name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 shrink-0" fallbackClassName="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-[#cbb4d4]/10 text-black dark:text-white font-black text-lg shrink-0" />"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done exact replaces!")
