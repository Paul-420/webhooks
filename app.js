// app.js
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const simpleGit = require("simple-git");

const app = express();
const PORT = 3000;
const GITHUB_SECRET = "my_webhook_secret"; // Remplacez par votre secret GitHub
const REPO_PATH = "\Users\paulj\OneDrive\Bureau\webhook"; // Remplacez par le chemin de votre dépôt local

// Middleware pour analyser les corps JSON
app.use(bodyParser.json());

// Middleware pour vérifier la signature du webhook
function verifyGithubSignature(req, res, buf, encoding) {
    const signature = req.headers["x-hub-signature-256"];
    if (!signature) {
        return res.status(401).send("Signature manquante");
    }

    const hmac = crypto.createHmac("sha256", GITHUB_SECRET);
    hmac.update(buf, encoding);
    const digest = "sha256=" + hmac.digest("hex");

    if (signature !== digest) {
        return res.status(401).send("Signature invalide");
    }
}

// Utiliser le middleware de vérification de signature
app.use(bodyParser.json({ verify: verifyGithubSignature }));

// Endpoint pour le webhook
app.post("/webhook", (req, res) => {
    const event = req.headers["x-github-event"];
    const payload = req.body;

    if (event === "push" && payload.ref === "refs/heads/main") { // Remplacez 'main' par la branche que vous suivez
        console.log("Push détecté sur la branche principale.");
        
        // Pull le dernier code du dépôt
        const git = simpleGit(REPO_PATH);
        git.pull((err, update) => {
            if (err) {
                console.error("Erreur lors du pull:", err);
                return res.status(500).send("Erreur lors du pull");
            }
            if (update && update.summary.changes) {
                console.log("Dépôt mis à jour:", update.summary);
                // Ici, vous pouvez déclencher le processus de build ou toute autre action nécessaire
            }
            res.status(200).send("Webhook reçu et traité");
        });
    } else {
        res.status(200).send("Webhook reçu mais pas traité");
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
