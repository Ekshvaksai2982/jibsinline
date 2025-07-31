document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://jobsinline.onrender.com';

  const fetchWithTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      )
    ]);
  };

  // Job roles list
  const jobRoles = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Mobile App Developer", "Android Developer", "iOS Developer", "DevOps Engineer",
    "Cloud Engineer", "Data Scientist", "Machine Learning Engineer", "Artificial Intelligence Engineer",
    "Data Analyst", "Business Analyst", "Product Manager", "Project Manager",
    "Scrum Master", "QA Engineer", "Automation Test Engineer", "Manual Test Engineer",
    "UI/UX Designer", "Graphic Designer", "Web Designer", "Technical Writer",
    "Database Administrator", "SQL Developer", "Big Data Engineer", "Hadoop Developer",
    "Spark Developer", "Data Engineer", "ETL Developer", "Blockchain Developer",
    "Cybersecurity Analyst", "Ethical Hacker", "Network Engineer", "System Administrator",
    "IT Support Specialist", "IT Consultant", "Solutions Architect", "Enterprise Architect",
    "Software Architect", "Application Support Engineer", "Embedded Systems Engineer", "Firmware Engineer",
    "Game Developer", "Unity Developer", "AR/VR Developer", "Python Developer",
    "Java Developer", "C++ Developer", "C# Developer", ".NET Developer",
    "PHP Developer", "Ruby on Rails Developer", "Node.js Developer", "Angular Developer",
    "React Developer", "Vue.js Developer", "Django Developer", "Flask Developer",
    "Spring Boot Developer", "Laravel Developer", "WordPress Developer", "Magento Developer",
    "Shopify Developer", "Salesforce Developer", "SAP Consultant", "Oracle Developer",
    "ERP Implementation Specialist", "CRM Developer", "BI Developer", "Power BI Developer",
    "Tableau Developer", "QlikView Developer", "SAS Developer", "R Developer",
    "MATLAB Developer", "API Developer", "Microservices Developer", "Kubernetes Administrator",
    "Docker Specialist", "Site Reliability Engineer (SRE)", "Release Manager", "Configuration Manager",
    "Change Manager", "Incident Manager", "Problem Manager", "IT Auditor",
    "Compliance Officer", "Risk Manager", "Digital Marketing Specialist", "SEO Specialist",
    "Content Writer", "Social Media Manager", "Growth Hacker", "Product Owner",
    "Agile Coach", "Business Development Manager", "Sales Engineer", "Pre-Sales Consultant",
    "Customer Success Manager", "Technical Support Engineer", "Hardware Engineer", "IoT Developer",
    "Robotics Engineer", "Computer Vision Engineer", "NLP Engineer", "Chatbot Developer",
    "Voice Assistant Developer", "Cloud Architect", "AWS Solutions Architect", "Azure Developer",
    "Google Cloud Engineer", "AI Research Scientist", "Quantum Computing Engineer", "Bioinformatics Specialist",
    "Fintech Developer", "Edtech Developer", "Healthtech Developer", "E-commerce Specialist",
    "Supply Chain Analyst", "Logistics Analyst", "GIS Developer", "3D Modeler",
    "Animator", "Video Editor", "Audio Engineer", "Game Tester",
    "Localization Specialist", "Translation Specialist", "Legal Tech Consultant", "HR Tech Specialist",
    "Recruitment Consultant", "Learning & Development Specialist", "Corporate Trainer", "IT Trainer",
    "Coding Instructor", "Freelance Developer", "Startup Founder", "Tech Entrepreneur",
    "Venture Capitalist", "Angel Investor", "Tech Journalist", "Tech Blogger",
    "Open Source Contributor", "Community Manager", "Event Manager", "Tech Evangelist",
    "Innovation Manager", "RPA Developer", "Low-Code/No-Code Developer", "Chatbot Trainer",
    "AI Ethicist", "Data Privacy Officer", "Cloud Security Engineer", "Penetration Tester",
    "Digital Forensics Analyst", "Incident Response Specialist", "Threat Intelligence Analyst", "Malware Analyst",
    "Cryptography Specialist", "Compliance Analyst", "IT Procurement Specialist", "Vendor Manager",
    "IT Finance Analyst", "IT Strategy Consultant"
  ].sort((a, b) => a.localeCompare(b));

  // Greeting logic
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');
  if (username) {
    const heroParagraph = document.querySelector('.hero p');
    if (heroParagraph) {
      heroParagraph.innerHTML = `Hello, <strong>${username}</strong>! 🚀 Transform your job search with AI-powered resume analysis and personalized career insights.`;
    }
  }

  // Job role search functionality
  const jobRoleSearch = document.getElementById('jobRoleSearch');
  const jobRoleInput = document.getElementById('jobRole');
  const suggestionsBox = document.getElementById('jobRoleSuggestions');

  if (jobRoleSearch && jobRoleInput && suggestionsBox) {
    jobRoleSearch.addEventListener('input', () => {
      const query = jobRoleSearch.value.trim().toLowerCase();
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';

      if (query) {
        const filteredRoles = jobRoles.filter(role => role.toLowerCase().startsWith(query));
        if (filteredRoles.length > 0) {
          filteredRoles.forEach(role => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('suggestion-item');
            suggestion.textContent = role;
            suggestion.addEventListener('click', () => {
              jobRoleSearch.value = role;
              jobRoleInput.value = role;
              suggestionsBox.innerHTML = '';
              suggestionsBox.style.display = 'none';
            });
            suggestionsBox.appendChild(suggestion);
          });
          suggestionsBox.style.display = 'block';
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!jobRoleSearch.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    });
  } else {
    console.error('Job role search elements not found');
  }

  // Resume form submission
  const resumeForm = document.getElementById('resumeForm');
  if (resumeForm) {
    resumeForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const resultContent = document.getElementById('resultContent');
      const loading = document.getElementById('loading');
      const submitBtn = document.querySelector('.submit-btn');

      if (!resultContent || !loading || !submitBtn) {
        console.error('Result elements not found');
        return;
      }

      resultContent.style.opacity = '0';
      resultContent.innerHTML = '';
      resultContent.classList.remove('error', 'result-success');
      loading.style.display = 'block';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      const resumeFile = document.getElementById('resume').files[0];
      const jobRole = jobRoleInput.value || jobRoleSearch.value;
      const usernameInput = username || 'N/A';

      if (!resumeFile || !jobRole) {
        showError('Please upload a resume and select a job role.');
        return;
      }

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobRole', jobRole);
      formData.append('username', usernameInput);

      try {
        const response = await fetchWithTimeout(`${BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(`Server responded with ${response.status}`);

        const data = await response.json();
        loading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';

        if (data.error) {
          showError(data.error);
        } else {
          resultContent.classList.add('result-success');
          resultContent.innerHTML = `
            <p><h3>Analysis Results</h3></p>
            <p><strong>Target Role:</strong> ${data.jobRole}</p>
            <p><strong>Hiring Probability:</strong> ${data.probability}%</p>
            <p><strong>Recommendations:</strong></p>
            <p><span><strong>Skills:</strong> ${data.additionalSkills || 'None identified'}</span></p>
            <p><span><strong>Frameworks:</strong> ${data.additionalFrameworks || 'None identified'}</span></p>
            <p><strong>Feedback:</strong> ${data.feedback}</p>
            ${data.fromChatbot ? '<p><em>(Skills and frameworks fetched from AI)</em></p>' : ''}
          `;
          resultContent.style.opacity = '1';
          resultContent.style.transition = 'opacity 0.5s ease';
        }
      } catch (error) {
        showError(`An error occurred: ${error.message}`);
      }

      function showError(message) {
        loading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        resultContent.classList.add('error');
        resultContent.innerHTML = `<p>${message}</p>`;
        resultContent.style.opacity = '1';
        resultContent.style.transition = 'opacity 0.5s ease';
      }
    });
  } else {
    console.error('Resume form not found');
  }

  // Chatbot functionality (JIL.ae style)
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotContainer = document.getElementById('chatbotContainer');
  const closeChatbot = document.getElementById('closeChatbot');
  const chatMessages = document.getElementById('chatMessages');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');
  let isTyping = false;

  if (chatbotToggle && chatbotContainer && closeChatbot && chatMessages && userInput && sendButton) {
    chatbotToggle.addEventListener('click', () => {
      chatbotContainer.style.display = chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '' ? 'flex' : 'none';
      if (chatbotContainer.style.display === 'flex' && chatMessages.children.length === 0) {
        setTimeout(() => {
          addMessage("Hello! I'm JOBSINLINE AI, powered by Google Generative AI. How can I assist you today?", 'bot-message');
        }, 800);
      }
    });

    closeChatbot.addEventListener('click', () => {
      chatbotContainer.style.display = 'none';
    });

    async function sendMessage() {
      const message = userInput.value.trim();
      if (message === '') return;

      addMessage(message, 'user-message');
      userInput.value = '';

      showTypingIndicator();

      try {
        const response = await fetchWithTimeout(`${BASE_URL}/chatbot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        removeTypingIndicator();
        addMessage(data.response, 'bot-message');
      } catch (error) {
        removeTypingIndicator();
        addMessage(`Sorry, something went wrong: ${error.message}`, 'bot-message');
      }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    function addMessage(text, className) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', className);
      messageDiv.innerHTML = `
        <div>${text}</div>
        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      `;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
      if (isTyping) return;
      const typingDiv = document.createElement('div');
      typingDiv.classList.add('typing-indicator');
      typingDiv.id = 'typingIndicator';
      typingDiv.innerHTML = `
        <span>JOBSINLINE AI is typing</span>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      isTyping = true;
    }

    function removeTypingIndicator() {
      const typingIndicator = document.getElementById('typingIndicator');
      if (typingIndicator) typingIndicator.remove();
      isTyping = false;
    }
  } else {
    console.error('Chatbot elements not found:', {
      chatbotToggle: !!chatbotToggle,
      chatbotContainer: !!chatbotContainer,
      closeChatbot: !!closeChatbot,
      chatMessages: !!chatMessages,
      userInput: !!userInput,
      sendButton: !!sendButton
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });
});