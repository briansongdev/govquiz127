import clientPromise from "../../lib/mongodb";

export default async function hello(req, res) {
  if (req.method == "POST") {
    const client = await clientPromise;
    const db = client.db("apgov127");
    const qname = "q" + req.body.questionNumber;
    const aname = "a" + req.body.questionNumber;
    if (req.body.correct) {
      await db.collection("metrics").updateOne(
        {},
        {
          $inc: {
            [qname]: 1,
            [aname]: 1,
          },
        }
      );
    } else {
      await db.collection("metrics").updateOne(
        {},
        {
          $inc: {
            [qname]: 1,
            [aname]: 0,
          },
        }
      );
    }
    return res.status(200).json({ success: false });
  } else {
    return res.status(401).json({ success: false });
  }
}
