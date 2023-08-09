const puppeteer = require("puppeteer");
const express = require("express");
const router = express.Router();

const typeWithDelay = async (page, selector, text, delay = 100) => {
  // Digita cada caractere com um pequeno intervalo de tempo para simular a digitação humana
  for (let char of text) {
    await page.type(selector, char);
    await page.waitForTimeout(delay);
  }
};

router.post("/facebook-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://www.facebook.com/");

  console.log("Digitando e-mail...");
  await typeWithDelay(page, "#email", email);

  await page.waitForTimeout(500); // espera meio segundo

  console.log("Digitando senha...");
  await typeWithDelay(page, "#pass", password);

  await page.click('[type="submit"]');

  // Aguardar um pouco para que a página carregue após a tentativa de login
  await page.waitForTimeout(2000);

  // Vamos verificar se a tentativa de login foi bem-sucedida verificando a presença de um elemento específico.
  // No caso do Facebook, a presença do elemento '#blueBarDOMInspector' pode indicar um login bem-sucedido.
  const loginSuccessful = (await page.$("#blueBarDOMInspector")) !== null;

  await browser.close();

  if (loginSuccessful) {
    res.status(200).send("Logged in successfully");
  } else {
    res.status(401).send("Login failed");
  }
});

module.exports = router;
