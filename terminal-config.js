// Edit this file, then run npm run build. See CUSTOMIZATION.md.
export default {
  profile: {
    name: 'Rishitha', fullName: 'Reddy Rishitha Reddy',
    role: 'Backend & Data Platforms', label: 'Software Engineer',
    intro: 'I build backend systems for payments and data platforms, with experience in transaction recovery, real-time pipelines, and developer workflows.',
    about: 'From recovering payment transactions to making data pipelines more resilient, I enjoy working on the systems behind the experience. My work spans backend engineering, payment integrations, orchestration, and machine learning.',
    aboutMore: 'My foundation is in Data Science and Artificial Intelligence at IIT Bhilai. Today, I bring that curiosity to backend systems, payments, and data platforms.',
    email: 'rishitha4005@gmail.com', githubUsername: 'RishithaR-388',
    resume: '', phone: '', availability: '',
  },
  links: [
    {name:'GitHub', url:'https://github.com/RishithaR-388'},
    {name:'LinkedIn', url:'https://www.linkedin.com/in/rishitha-reddy-86701322a'},
    {name:'LeetCode', url:'https://leetcode.com/u/rizz_2929/'},
  ],
  theme: {defaultTheme:'system', accent:'', font:'system'},
  features: {ascii:true, motion:true, github:true, extras:false, themeSelector:true, showPhone:false},
  metrics: [
    {value:'$1M+', label:'Recovered merchant revenue', context:'Contributed to Merchant Retry Experience at Visa.', visible:true},
    {value:'94%', label:'Reduction in deployment time', context:'Refactored and consolidated platform services at Visa.', visible:true},
  ],
  experience: [
    {company:'Visa', mark:'V', period:'Mar 2025 — Present', roles:[
      {title:'Software Engineer', team:'Data & Platform', period:'Mar 2025 — Present', summary:'Building resilient payment and data infrastructure.', bullets:[
        'Designed and implemented Merchant Retry Experience, scaling it into a multi-tenant platform for enterprise merchants and contributing to $1M+ in recovered merchant revenue.',
        'Expanded real-time authorization pipelines across two additional data centers to improve platform resilience.',
        'Integrated business and operational metrics across data processing jobs, enabling real-time monitoring and visualization in Grafana.',
        'Consolidated four interdependent microservices into a single repository, simplifying orchestration and reducing deployment time by 94%.',
      ]},
    ]},
    {company:'PocketFM', mark:'P', period:'Dec 2023 — Mar 2025', roles:[
      {title:'Software Engineer', team:'Payments', period:'May 2024 — Mar 2025', summary:'Improving payment integrations and backend operations.', bullets:[
        'Developed and deployed A/B experiments that resulted in a 4% increase in ads revenue.',
        'Revamped Juspay payment webhooks and migrated them to the v3 service.',
        'Optimized database access by migrating reads between tables and deprecating the former; participated in payment on-call rotations.',
      ]},
      {title:'Backend Developer Intern', team:'Backend Engineering', period:'Dec 2023 — Apr 2024', summary:'Making backend workflows easier to schedule and maintain.', bullets:[
        'Migrated backend jobs and DAGs to Airflow to improve task scheduling and management.',
        'Enhanced existing APIs with new features and functionality.',
      ]},
    ]},
    {company:'SpeedLabs', mark:'S', period:'May — Jul 2022', roles:[
      {title:'Tech Intern', team:'Data Analytics', period:'May — Jul 2022', summary:'Connecting machine learning with useful data tools.', bullets:[
        'Automated an ML model to segment and classify JEE question images, achieving 92% accuracy on that task.',
        'Built a dynamic visualization dashboard with Plotly, Dash, and SQL.',
        'Recognized as Best Team Player.',
      ]},
    ]},
  ],
  projects: [
    {id:'recommendations', number:'01', kind:'Personal project', title:'A better next pick.', subtitle:'Recommendation System',
      description:'Finding the next movie, series, or book with recommendations built around user preferences.',
      tags:['Python','Streamlit','TF-IDF'], steps:['Your preferences','Text vectors','Top 10 picks'],
      problem:'Help users explore movies, series, and books through a preference-based recommendation interface.',
      approach:'A Streamlit-based application uses TF-IDF and count vectorization for recommendations across the three content categories.',
      outcome:'A deployed Streamlit application that returns a top-10 recommendation list based on user preferences.',
      source:'https://github.com/RishithaR-388/Recommendation-System', demo:'', image:'',
    },
    {id:'deepweeds', number:'02', kind:'Honours research', title:'Learning what grows.', subtitle:'ML for precision agriculture',
      description:'Exploring how deep learning can support weed recognition in precision agriculture.',
      tags:['EfficientNet','DeepWeeds','Computer Vision'], steps:['DeepWeeds images','EfficientNet','Weed recognition'],
      problem:'Explore machine-learning applications in precision agriculture through an honours research project at IIT Bhilai.',
      approach:'Worked under the supervision of Dr. Nitin Khanna, applying EfficientNet architecture to the DeepWeeds dataset.',
      outcome:'Achieved 96% accuracy on the DeepWeeds dataset, as reported in my honours research résumé entry.',
      source:'', demo:'', image:'',
    },
  ],
  skills: [
    {name:'Languages', items:['Java','Python','SQL']},
    {name:'Backend & APIs', items:['Django','REST APIs']},
    {name:'Data & Orchestration', items:['Kafka','Spark','Airflow','Hadoop','Hive']},
    {name:'Databases', items:['MySQL','Redis','MongoDB','Cassandra','RocksDB']},
    {name:'Cloud & Delivery', items:['Docker','Jenkins','GitHub Actions','Ansible','Chef','AWS']},
  ],
  education: {school:'IIT Bhilai', degree:'BTech · Data Science & Artificial Intelligence', honours:'Honours', period:'2020 — 2024', cgpa:'8.4', description:'Honours research in machine learning for precision agriculture, supervised by Dr. Nitin Khanna.'},
};
