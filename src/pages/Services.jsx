import React from "react";

/* ================================================= */
/* SKILLS DATA WITH DEVICON SVGS                     */
/* ================================================= */

const skillCategories = [
  {
    title: "USING NOW:",
    skills: [
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
      { name: "Node Js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
      { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" },
      { name: ".NET", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    ],
  },
  {
    title: "CLOUD & DEVOPS:",
    skills: [
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
      { name: "Nginx", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg" },
      { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" },
      { name: "GH Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
    ],
  },
  {
    title: "LEARNING NOW:",
    skills: [
      { name: "Mongo DB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    ],
  },
  {
    title: "OTHER SKILLS:",
    skills: [
      { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
    ],
  },
];

/* ================================================= */
/* MAIN COMPONENT                                    */
/* ================================================= */

const Skills = () => {
  return (
    // The background color matches the light gray from your screenshot
    <section className="min-h-screen bg-[#dadada] py-20 font-sans text-black">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Centered Bordered Header */}
        <div className="flex justify-center mb-24">
          <h1 className="border-[3px] border-black px-6 py-2 text-3xl md:text-4xl font-bold tracking-widest bg-transparent">
            SKILLS
          </h1>
        </div>

        {/* Map through categories */}
        <div className="space-y-24">
          {skillCategories.map((category, catIndex) => (
            <div key={catIndex} className="max-w-2xl mx-auto">
              
              {/* Category Title */}
              <h2 className="text-xl md:text-2xl font-bold mb-12 tracking-wide uppercase">
                {category.title}
              </h2>

              {/* 3-Column Grid for Skills */}
              <div className="grid grid-cols-3 gap-y-16 gap-x-8">
                {category.skills.map((skill, index) => (
                  <div key={index} className="flex flex-col items-center justify-start group hover:-translate-y-2 transition-transform duration-300">
                    
                    {/* Icon Container */}
                    <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-4">
                      <img 
                        src={skill.icon} 
                        alt={`${skill.name} icon`} 
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>
                    
                    {/* Skill Name */}
                    <span className="text-xs md:text-sm font-bold text-center">
                      {skill.name}
                    </span>
                    
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;