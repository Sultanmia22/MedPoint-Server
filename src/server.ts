import app from "./app.ts";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`MedPoint API listening on port ${port}`);
});