// TRANSLATIONS OBJECT FOR MULTI-LANGUAGE SUPPORT

const translations = {
    en: {
        // Header Navigation
        home: "Home",
        blog: "Blog",
        about: "About",
        contact: "Contact",
        back_home: "Back to Home",

        // Hero Section
        hero_title: "Master DevOps & Automation",
        hero_desc: "Learn Linux, Git, Docker, Kubernetes, Terraform, Ansible, GitOps, CI/CD pipelines, and Cloud platforms through hands-on, step-by-step training designed to make you job-ready.",
        
        // Blog Page
        blog_hero_title: "FOMA DevOps Learning Hub",
        blog_hero_subtitle: "Learn Docker, Kubernetes, Terraform, CI/CD, Cloud and Linux step by step",
        blog_search_placeholder: "Search blog posts...",
        blog_categories: "Categories",
        blog_all: "All",
        blog_docker: "Docker",
        blog_kubernetes: "Kubernetes",
        blog_terraform: "Terraform",
        blog_cicd: "CI/CD",
        blog_cloud: "Cloud",
        blog_linux: "Linux",
        blog_devsecops: "DevSecOps",
        blog_load_more: "Load More Posts",
        blog_no_posts: "No posts found",

        // Blog Posts
        read_more: "Read More",
        article1_title: "Introduction to DevOps",
        article1_desc: "Learn the fundamentals of DevOps.",

        // Sample Blog Posts
        post_01_title: "Docker Fundamentals: Containerize Your Applications",
        post_01_desc: "Learn how to containerize your applications using Docker. This comprehensive guide covers images, containers, and best practices.",
        post_02_title: "Kubernetes Overview: Orchestrating Containers at Scale",
        post_02_desc: "Discover how Kubernetes automates deployment, scaling, and management of containerized applications.",
        post_03_title: "Terraform Basics: Infrastructure as Code",
        post_03_desc: "Master the fundamentals of Infrastructure as Code using Terraform for cloud resource management.",
        post_04_title: "CI/CD Pipelines with Jenkins",
        post_04_desc: "Build automated CI/CD pipelines using Jenkins to improve development velocity and reliability.",
        post_05_title: "AWS Cloud Architecture Essentials",
        post_05_desc: "Learn core AWS services and how to architect scalable, reliable cloud solutions.",
        post_06_title: "Linux System Administration Basics",
        post_06_desc: "Master essential Linux commands and system administration skills for DevOps engineers.",
        post_09_title: "Linux for DevOps Beginners",
        post_09_desc: "Learn essential Linux skills for DevOps engineers.",
        post_07_title: "Container Security Best Practices",
        post_07_desc: "Learn how to secure your containerized applications and cloud infrastructure.",
        post_08_title: "Kubernetes Networking Deep Dive",
        post_08_desc: "Understand networking in Kubernetes and how to design robust network architectures.",

        // Common
        author: "FOMA",
        by: "By",
    },
    fr: {
        // Header Navigation
        home: "Accueil",
        blog: "Blog",
        about: "À propos",
        contact: "Contact",
        back_home: "Retour à l'accueil",

        // Hero Section
        hero_title: "Maîtrisez le DevOps & l'Automatisation",
        hero_desc: "Apprenez Docker, Kubernetes, Terraform, CI/CD et le Cloud étape par étape avec une formation pratique conçue pour vous rendre opérationnel.",
        
        // Blog Page
        blog_hero_title: "Centre d'Apprentissage DevOps FOMA",
        blog_hero_subtitle: "Apprenez Docker, Kubernetes, Terraform, CI/CD, Cloud et Linux étape par étape",
        blog_search_placeholder: "Rechercher des articles...",
        blog_categories: "Catégories",
        blog_all: "Tous",
        blog_docker: "Docker",
        blog_kubernetes: "Kubernetes",
        blog_terraform: "Terraform",
        blog_cicd: "CI/CD",
        blog_cloud: "Cloud",
        blog_linux: "Linux",
        blog_devsecops: "DevSecOps",
        blog_load_more: "Charger plus d'articles",
        blog_no_posts: "Aucun article trouvé",

        // Blog Posts
        read_more: "Lire la suite",
        article1_title: "Introduction à DevOps",
        article1_desc: "Apprenez les fondamentaux de DevOps.",

        // Sample Blog Posts
        post_01_title: "Fondamentaux Docker : Conteneurisez vos applications",
        post_01_desc: "Apprenez à conteneuriser vos applications avec Docker. Ce guide complet couvre les images, les conteneurs et les bonnes pratiques.",
        post_02_title: "Aperçu de Kubernetes : Orchestration à grande échelle",
        post_02_desc: "Découvrez comment Kubernetes automatise le déploiement, la mise à l'échelle et la gestion des applications conteneurisées.",
        post_03_title: "Les bases de Terraform : Infrastructure as Code",
        post_03_desc: "Maîtrisez les fondamentaux d'Infrastructure as Code avec Terraform pour la gestion des ressources cloud.",
        post_04_title: "Pipelines CI/CD avec Jenkins",
        post_04_desc: "Construisez des pipelines CI/CD automatisés avec Jenkins pour améliorer la vélocité et la fiabilité.",
        post_05_title: "Essentiels de l'architecture AWS Cloud",
        post_05_desc: "Apprenez les services AWS essentiels et comment concevoir des solutions cloud scalables et fiables.",
        post_06_title: "Bases de l'administration système Linux",
        post_06_desc: "Maîtrisez les commandes Linux essentielles et les compétences d'administration système pour les ingénieurs DevOps.",
        post_09_title: "Linux pour les débutants DevOps",
        post_09_desc: "Apprenez les compétences Linux essentielles pour les ingénieurs DevOps.",
        post_07_title: "Bonnes pratiques de sécurité des conteneurs",
        post_07_desc: "Apprenez à sécuriser vos applications conteneurisées et votre infrastructure cloud.",
        post_08_title: "Plongée profonde dans la mise en réseau Kubernetes",
        post_08_desc: "Comprenez la mise en réseau dans Kubernetes et comment concevoir des architectures réseau robustes.",

        // Common
        author: "FOMA",
        by: "Par",
    }
};

// BLOG POSTS DATA
const blogPosts = [
    {
        id: 1,
        title: {
            en: translations.en.post_01_title,
            fr: translations.fr.post_01_title
        },
        description: {
            en: translations.en.post_01_desc,
            fr: translations.fr.post_01_desc
        },
        category: "docker",
        date: "2026-04-01",
        author: "FOMA",
        image: "images/docker.png",
        featured: true
    },
    {
        id: 2,
        title: {
            en: translations.en.post_02_title,
            fr: translations.fr.post_02_title
        },
        description: {
            en: translations.en.post_02_desc,
            fr: translations.fr.post_02_desc
        },
        category: "kubernetes",
        date: "2026-03-28",
        author: "FOMA",
        image: "images/kubernetes.png",
        featured: true
    },
    {
        id: 3,
        title: {
            en: translations.en.post_03_title,
            fr: translations.fr.post_03_title
        },
        description: {
            en: translations.en.post_03_desc,
            fr: translations.fr.post_03_desc
        },
        category: "terraform",
        date: "2026-03-25",
        author: "FOMA",
        image: "images/terraform.png",
        featured: true
    },
    {
        id: 4,
        title: {
            en: translations.en.post_04_title,
            fr: translations.fr.post_04_title
        },
        description: {
            en: translations.en.post_04_desc,
            fr: translations.fr.post_04_desc
        },
        category: "cicd",
        date: "2026-03-22",
        author: "FOMA",
        image: "images/cicd.png",
        featured: false
    },
    {
        id: 5,
        title: {
            en: translations.en.post_05_title,
            fr: translations.fr.post_05_title
        },
        description: {
            en: translations.en.post_05_desc,
            fr: translations.fr.post_05_desc
        },
        category: "cloud",
        date: "2026-03-20",
        author: "FOMA",
        image: "images/cloud.png",
        featured: false
    },
    {
        id: 6,
        title: {
            en: translations.en.post_06_title,
            fr: translations.fr.post_06_title
        },
        description: {
            en: translations.en.post_06_desc,
            fr: translations.fr.post_06_desc
        },
        category: "linux",
        date: "2026-03-18",
        author: "FOMA",
        image: "images/linux.png",
        featured: false
    },
    {
        id: 7,
        title: {
            en: translations.en.post_07_title,
            fr: translations.fr.post_07_title
        },
        description: {
            en: translations.en.post_07_desc,
            fr: translations.fr.post_07_desc
        },
        category: "devsecops",
        date: "2026-03-15",
        author: "FOMA",
        image: "images/devsecops.png",
        featured: false
    },
    {
        id: 8,
        title: {
            en: translations.en.post_08_title,
            fr: translations.fr.post_08_title
        },
        description: {
            en: translations.en.post_08_desc,
            fr: translations.fr.post_08_desc
        },
        category: "kubernetes",
        date: "2026-03-12",
        author: "FOMA",
        image: "images/kubernetes.png",
        featured: false
    },
    {
        id: 9,
        title: {
            en: translations.en.post_09_title,
            fr: translations.fr.post_09_title
        },
        description: {
            en: translations.en.post_09_desc,
            fr: translations.fr.post_09_desc
        },
        category: "linux",
        date: "2026-04-04",
        author: "FOMA",
        image: "images/linux.png",
        featured: false
    }
];
