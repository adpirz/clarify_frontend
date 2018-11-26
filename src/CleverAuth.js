const CLIENT_ID = process.env.REACT_APP_CLEVER_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLEVER_CLIENT_SECRET;
const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL || "http://localhost:3000";

function req({ url, ...props }) {
  return fetch(url, { mode: "no-cors", ...props });
}

async function runOAuthFlow(code) {
  console.log("getting token");
  const token = await getToken(code);

  console.log("getting me");
  const response = await request("/me", token);

  const data = response["data"];
  console.log("me data", data);

  console.log("user data", data);
  return {
    id: data.id,
    type: data.type,
    token: token,
  };
}

async function getToken(code) {
  var auth = new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  var token_options = {
    url: "https://clever.com/oauth/tokens",
    headers: { Authorization: "Basic " + auth },
    form: {
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URL,
    },
    method: "POST",
    json: true,
  };

  const data = await req(token_options);
  return data["access_token"];
}

async function request(route, token) {
  var url = `https://api.clever.com/v2.0${route}`;

  const data = req({
    url: url,
    headers: { Authorization: `Bearer ${token}` },
    json: true,
  });

  return data;
}

async function getMyInfo(user_id, user_type, token) {
  var route = `/${user_type}s/${user_id}`;
  const response = await request(route, token);

  return response["data"];
}

async function getMySections(user_id, user_type, token) {
  var route = `/${user_type}s/${user_id}/sections`;
  const response = await request(route, token);

  return response["data"];
}

async function getMySectionsWithStudents(user_id, user_type, token) {
  var route = `/${user_type}s/${user_id}/sections`;
  const response = await request(route, token);

  const sections = response["data"];

  // for every section, go fetch the data for each of its students
  await Promise.all(
    sections.map(async section => {
      section.data.students = await getStudentsForSection(section.data.id, token);
    })
  );

  return sections;
}

async function getStudentsForSection(section_id, token) {
  var route = `/sections/${section_id}/students`;
  const response = await request(route, token);

  return response["data"];
}

const clever = {
  request: request,
  runOAuthFlow: runOAuthFlow,
  getMyInfo: getMyInfo,
  getMySections: getMySections,
  getMySectionsWithStudents: getMySectionsWithStudents,
  getStudentsForSection: getStudentsForSection,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectURL: REDIRECT_URL,
};

window.clever = clever;
export default clever;
