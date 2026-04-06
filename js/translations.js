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
        post_10_title: "Docker: Revolutionizing Software Development and Deployment",
        post_10_desc: "Discover how Docker transforms development and deployment with consistent, portable containers.",
        post_07_title: "Container Security Best Practices",
        post_07_desc: "Learn how to secure your containerized applications and cloud infrastructure.",
        post_08_title: "Kubernetes Networking Deep Dive",
        post_08_desc: "Understand networking in Kubernetes and how to design robust network architectures.",

        docker_rev_title: "Docker: Revolutionizing Software Development and Deployment",
        docker_rev_intro_1: "As a professional in the ever-evolving landscape of software engineering, few technologies have made as significant an impact on day-to-day work, and indeed the entire industry, as Docker. It is more than just a tool; it is a paradigm shift in how we build, ship, and run applications.",
        docker_rev_intro_2: "If you are not already leveraging Docker, you are missing out on a powerful ally in your development and operations workflow.",
        docker_rev_problem_title: "The Problem Docker Solves: \"It Works on My Machine\"",
        docker_rev_problem_1: "Teams frequently face a painful scenario: software works flawlessly on a developer machine, then breaks in testing or production. This classic \"works on my machine\" syndrome happens because of environmental inconsistencies such as different operating systems, library versions, dependencies, and runtime configurations.",
        docker_rev_problem_2: "The result is wasted time, difficult debugging cycles, and delayed deployments across the software lifecycle.",
        docker_rev_containerization_title: "Enter Containerization: A Game Changer",
        docker_rev_containerization_1: "Docker addresses this challenge directly through containerization. It packages an application and all dependencies, including libraries, frameworks, and configuration, into a standardized unit called a container.",
        docker_rev_containerization_2: "This container is isolated from the underlying host system, which ensures the application behaves consistently wherever it is deployed.",
        docker_rev_containerization_3: "A simple way to compare approaches is this: if virtual machines are full houses with their own operating systems, containers are self-contained apartments in a shared building. They share the host kernel but remain isolated for each application.",
        docker_rev_containerization_4: "This lightweight model makes containers efficient and very fast to start.",
        docker_rev_key_title: "Key Concepts to Understand",
        docker_rev_key_1_title: "1. Docker Images",
        docker_rev_key_1_text: "Docker images are read-only templates containing the application and all required dependencies. An image acts as the blueprint for creating containers. You can build custom images or pull existing images from Docker Hub.",
        docker_rev_key_2_title: "2. Docker Containers",
        docker_rev_key_2_text: "Containers are runnable instances of Docker images. When you run an image, it becomes a container that can be started, stopped, moved, and removed as needed.",
        docker_rev_key_3_title: "3. Dockerfile",
        docker_rev_key_3_text: "A Dockerfile is a plain text instruction file that automates image creation. It makes builds reproducible, consistent, and versionable.",
        docker_rev_key_4_title: "4. Docker Hub and Registries",
        docker_rev_key_4_text: "Registries are centralized repositories for storing and sharing images. Docker Hub is the most widely used public registry, while private registries are common in enterprise environments.",
        docker_rev_benefits_title: "The Undeniable Benefits of Docker",
        docker_rev_benefit_1: "Consistency and Portability: Applications run the same way from local development to staging and production, reducing environment-related issues.",
        docker_rev_benefit_2: "Rapid Deployment: Containers are lightweight and start quickly, which supports faster release cycles.",
        docker_rev_benefit_3: "Isolation: Each container runs independently, reducing conflicts between applications and services.",
        docker_rev_benefit_4: "Resource Efficiency: Containers share the host kernel, which reduces overhead compared to virtual machines.",
        docker_rev_benefit_5: "Scalability: Teams can scale services by running additional containers, often with orchestration platforms like Kubernetes.",
        docker_rev_benefit_6: "Version Control: Dockerfiles can be versioned like application code, improving traceability and change management.",
        docker_rev_benefit_7: "Simplified Collaboration: Developers can share consistent environments, making teamwork more predictable and efficient.",
        docker_rev_getting_started_title: "Getting Started with Docker",
        docker_rev_getting_started_1: "If you are new to Docker, the best approach is hands-on learning. Start by installing Docker Desktop and practicing key commands.",
        docker_rev_getting_started_2: "These commands cover pulling images, running containers, listing active containers, stopping workloads, and building custom images from a Dockerfile.",
        docker_rev_getting_started_3: "There are many excellent tutorials available to guide you through your first Dockerized application and real DevOps use cases.",
        docker_rev_conclusion_title: "Conclusion",
        docker_rev_conclusion_1: "Docker has become an indispensable technology in modern software development and operations. Its ability to create consistent, portable, and efficient runtime environments has transformed application delivery.",
        docker_rev_conclusion_2: "By embracing containerization, teams can accelerate development, reduce environment-related issues, and build systems that are more robust and scalable. For professionals and organizations that have not yet adopted Docker, now is the right time to start and unlock its full potential.",
        docker_rev_next_step_title: "Next Step",
        docker_rev_next_step_text: "Continue with Kubernetes to orchestrate containers at scale and manage production workloads efficiently.",
        back_to_blog: "Back to Blog",
        share_article: "Share Article",
        share_copy_success: "Article link copied to clipboard.",
        share_copy_error: "Unable to copy the link. Please copy it manually.",

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
        post_10_title: "Docker : Révolutionner le développement et le déploiement de logiciels",
        post_10_desc: "Découvrez comment Docker transforme le développement et le déploiement avec des conteneurs cohérents et portables.",
        post_07_title: "Bonnes pratiques de sécurité des conteneurs",
        post_07_desc: "Apprenez à sécuriser vos applications conteneurisées et votre infrastructure cloud.",
        post_08_title: "Plongée profonde dans la mise en réseau Kubernetes",
        post_08_desc: "Comprenez la mise en réseau dans Kubernetes et comment concevoir des architectures réseau robustes.",

        docker_rev_title: "Docker : Révolutionner le développement et le déploiement de logiciels",
        docker_rev_intro_1: "En tant que professionnel dans le paysage en constante évolution de l'ingénierie logicielle, peu de technologies ont eu un impact aussi important sur le travail quotidien, et sur l'ensemble de l'industrie, que Docker. Ce n'est pas seulement un outil ; c'est un changement de paradigme dans la façon de construire, livrer et exécuter les applications.",
        docker_rev_intro_2: "Si vous n'utilisez pas encore Docker, vous passez à côté d'un allié puissant pour votre flux de travail de développement et d'exploitation.",
        docker_rev_problem_title: "Le problème que Docker résout : \"Ça marche sur ma machine\"",
        docker_rev_problem_1: "Les équipes rencontrent souvent un scénario frustrant : le logiciel fonctionne parfaitement sur la machine du développeur, puis échoue en test ou en production. Ce syndrome classique vient des incohérences d'environnement comme les systèmes d'exploitation, versions de bibliothèques, dépendances et configurations d'exécution.",
        docker_rev_problem_2: "Le résultat est une perte de temps, des cycles de débogage difficiles et des déploiements retardés tout au long du cycle de vie logiciel.",
        docker_rev_containerization_title: "La conteneurisation : un véritable tournant",
        docker_rev_containerization_1: "Docker répond directement à ce défi grâce à la conteneurisation. Il empaquette une application et toutes ses dépendances, y compris bibliothèques, frameworks et configuration, dans une unité standardisée appelée conteneur.",
        docker_rev_containerization_2: "Ce conteneur est isolé du système hôte sous-jacent, ce qui garantit un comportement identique de l'application quel que soit l'environnement de déploiement.",
        docker_rev_containerization_3: "Pour comparer simplement : si les machines virtuelles sont des maisons entières avec leur propre système d'exploitation, les conteneurs sont des appartements autonomes dans un même immeuble. Ils partagent le noyau hôte tout en restant isolés pour chaque application.",
        docker_rev_containerization_4: "Ce modèle léger rend les conteneurs efficaces et très rapides à démarrer.",
        docker_rev_key_title: "Concepts clés à comprendre",
        docker_rev_key_1_title: "1. Images Docker",
        docker_rev_key_1_text: "Les images Docker sont des modèles en lecture seule contenant l'application et toutes les dépendances nécessaires. Une image sert de plan pour créer des conteneurs. Vous pouvez créer vos propres images ou en récupérer depuis Docker Hub.",
        docker_rev_key_2_title: "2. Conteneurs Docker",
        docker_rev_key_2_text: "Les conteneurs sont des instances exécutables d'images Docker. Lorsqu'une image est lancée, elle devient un conteneur que l'on peut démarrer, arrêter, déplacer et supprimer.",
        docker_rev_key_3_title: "3. Dockerfile",
        docker_rev_key_3_text: "Un Dockerfile est un fichier texte d'instructions qui automatise la création d'image. Il rend les builds reproductibles, cohérents et versionnables.",
        docker_rev_key_4_title: "4. Docker Hub et registres",
        docker_rev_key_4_text: "Les registres sont des dépôts centralisés pour stocker et partager des images. Docker Hub est le registre public le plus utilisé, tandis que les registres privés sont fréquents en entreprise.",
        docker_rev_benefits_title: "Les avantages indéniables de Docker",
        docker_rev_benefit_1: "Cohérence et portabilité : les applications s'exécutent de la même manière du poste local à la préproduction puis la production, en réduisant les problèmes d'environnement.",
        docker_rev_benefit_2: "Déploiement rapide : les conteneurs sont légers et démarrent vite, ce qui accélère les cycles de livraison.",
        docker_rev_benefit_3: "Isolation : chaque conteneur est indépendant, ce qui réduit les conflits entre applications et services.",
        docker_rev_benefit_4: "Efficacité des ressources : les conteneurs partagent le noyau hôte, ce qui réduit la surcharge par rapport aux machines virtuelles.",
        docker_rev_benefit_5: "Scalabilité : les équipes peuvent monter en charge en lançant plus de conteneurs, souvent avec des orchestrateurs comme Kubernetes.",
        docker_rev_benefit_6: "Contrôle de version : les Dockerfiles peuvent être versionnés comme le code, améliorant traçabilité et gestion des changements.",
        docker_rev_benefit_7: "Collaboration simplifiée : les développeurs partagent des environnements cohérents, rendant le travail d'équipe plus fiable.",
        docker_rev_getting_started_title: "Bien démarrer avec Docker",
        docker_rev_getting_started_1: "Si vous débutez avec Docker, la meilleure approche est la pratique. Installez Docker Desktop et testez les commandes essentielles.",
        docker_rev_getting_started_2: "Ces commandes couvrent le téléchargement d'images, l'exécution de conteneurs, la liste des conteneurs actifs, l'arrêt des charges et le build d'images depuis un Dockerfile.",
        docker_rev_getting_started_3: "De nombreux excellents tutoriels existent pour vous guider vers votre première application dockerisée et des cas d'usage DevOps concrets.",
        docker_rev_conclusion_title: "Conclusion",
        docker_rev_conclusion_1: "Docker est devenu une technologie indispensable dans le développement logiciel et les opérations modernes. Sa capacité à fournir des environnements cohérents, portables et efficaces a transformé la livraison applicative.",
        docker_rev_conclusion_2: "En adoptant la conteneurisation, les équipes accélèrent le développement, réduisent les problèmes d'environnement et construisent des systèmes plus robustes et évolutifs. Pour les professionnels et organisations qui ne l'ont pas encore adopté, c'est le bon moment pour commencer.",
        docker_rev_next_step_title: "Etape suivante",
        docker_rev_next_step_text: "Continuez avec Kubernetes pour orchestrer les conteneurs a grande echelle et gerer efficacement les charges de production.",
        back_to_blog: "Retour au blog",
        share_article: "Partager l'article",
        share_copy_success: "Le lien de l'article a ete copie.",
        share_copy_error: "Impossible de copier le lien. Veuillez le copier manuellement.",

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
    },
    {
        id: 10,
        title: {
            en: translations.en.post_10_title,
            fr: translations.fr.post_10_title
        },
        description: {
            en: translations.en.post_10_desc,
            fr: translations.fr.post_10_desc
        },
        category: "docker",
        date: "2026-04-06",
        author: "FOMA",
        image: "images/docker2.png",
        featured: true
    }
];
