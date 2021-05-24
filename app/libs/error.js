module.exports = {
  captcha_wrong: () => {
    return `Le code de verification que vous avez entré n'est pas correct`
  },
  create_failed: (name) => {
    return `erreur de créer nouveau ${name}`
  },
  is_required: (name) => {
    return `${name} est requis`
  },
  body_empty: () => {
    return `Il faut envoyer des données`
  },
  id_empty: (name) => {
    return `${name} id est requis`
  },
  id_wrong: (name) => {
    return `${name} id n'est pas bon, pas de données trouvées`
  },
  code_used: (name) => {
    return `${name} code a déjà été utilisé`
  },
  code_empty: (name) => {
    return `${name} code est requis`
  },
  code_wrong: (name) => {
    return `${name} code n'est pas bon, pas de données trouvées`
  },
  not_found: (name) => {
    return `pas de données de ${name} trouvées`
  },
  input_incorrect: () => {
    return `Données d'entrer ne sont pas bon`
  },
  no_permission: () => {
    return `l'utilisateur n'a pas de permission pour effectuer de cette action/ ou effectuer cette action avec des données d'entrer`
  },
  no_auth: () => {
    return `Vous devrez identifier pour effectuer cette action`
  },
  not_ready_for_sign: () => {
    return `Le dossier n'est pas prêt pour signer`
  },
  forbiden_input: () => {
    return `Données d'entrer ne sont pas permis`
  },
  login_failed: () => {
    return `Authentification échouée! vérifier vos données`
  },
  logout_failed: () => {
    return `Logout échouée!`
  },
  logout_required: () => {
    return `Il faut déconnecter pour effectuer cette action`
  },
  no_token: () => {
    return `Token d'accès est requise`
  },
  file_missing: () => {
    return `fichier manquant`
  },
  question_no_answer: (name) => {
    return `Vous n'avez pas encore répondu la question : "${name}"`
  },
  not_answer_all_question: () => {
    return `Les questions médical obligatoires (*) ne sont pas toutes répondues`;
  },
  not_ready_to_sign: () => {
    return `Les documents demandés sont manquants ou les questions médical obligatoires (*) ne sont pas toutes répondues`;
  },
  not_ready_to_close: () => {
    return `Le dossier n'est pas encore complet`;
  },
  not_ready_to_reopen: () => {
    return `Le dossier n'est pas encore complet traité`;
  }
}
