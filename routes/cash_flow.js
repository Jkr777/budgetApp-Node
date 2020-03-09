const express = require("express"),
      _ = require("lodash"),
      auth = require("../middleware/auth"),
      { User } = require("../model/user"),
      { Asset, Asset_joiValidation } = require("../model/asset"),
      { Liability, Liability_joiValidation } = require("../model/liability"),
      { Earning, Earning_joiValidation } = require("../model/earning"),
      { Spending, Spending_joiValidation } = require("../model/spending"),
      router = express.Router();
 
router.get("/assets", auth, async(req, res) => {
  const cash_flow = await User.findOne({_id: req.user._id})
    .populate('cash_flow.assets')
    .select('cash_flow.assets');
  if(!cash_flow) return res.status(401).send("Invalid user");

  res.status(200).send(cash_flow);
});

router.get("/liabilities", auth, async(req, res) => {
  const cash_flow = await User.findOne({_id: req.user._id})
    .populate('cash_flow.liabilities')
    .select('cash_flow.liabilities');
  if(!cash_flow) return res.status(401).send("Invalid user");

  res.status(200).send(cash_flow);
});

router.get("/earnings", auth, async(req, res) => {
  const cash_flow = await User.findOne({_id: req.user._id})
    .select('cash_flow.earnings');
  if(!cash_flow) return res.status(401).send("Invalid user");

  res.status(200).send(cash_flow);
});

router.get("/spendings", auth, async(req, res) => {
  const cash_flow = await User.findOne({_id: req.user._id})
    .select('cash_flow.spendings');
  if(!cash_flow) return res.status(401).send("Invalid user");

  res.status(200).send(cash_flow);
});

router.post("/add_assets", auth, async(req, res) => {
  const {error} = Asset_joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let addedProps = _.pick(req.body, ["title", "description", "amount"]);
  const new_asset = new Asset({...addedProps, user_id: req.user._id}); 

  const flow = await User.findOneAndUpdate(
    {
      _id: req.user._id
    },
    {
      $push: {'cash_flow.assets': new_asset},
      $inc: {
        'cash_flow.total': req.body.amount,
        'cash_flow.future_flow': req.body.amount,
        'cash_flow.assets_total': req.body.amount
      }
    }
  );
  if(!flow) return res.status(401).send("Invalid user or data");
  await new_asset.save();

  res.status(200).send(_.pick(new_asset, ["_id", "title", "description", "amount"]));
});

router.post("/add_liabilities", auth, async(req, res) => {
  const {error} = Liability_joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let addedProps = _.pick(req.body, ["title", "description", "amount"]);
  const new_liability = new Liability({...addedProps, user_id: req.user._id}); 

  const flow = await User.findOneAndUpdate(
    {
      _id: req.user._id
    },
    {
      $push: {'cash_flow.liabilities': new_liability},
      $inc: {
        'cash_flow.total': - req.body.amount,
        'cash_flow.future_flow': - req.body.amount,
        'cash_flow.liabilities_total': req.body.amount
      }
    }
  );
  if(!flow) return res.status(401).send("Invalid user or data");
  await new_liability.save();

  res.status(200).send(_.pick(new_liability, ["_id", "title", "description", "amount"]));
}); 

router.post("/add_earnings", auth, async(req, res) => { 
  const {error} = Earning_joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  let props = _.pick(req.body, ["title", "description", "amount"]);
  const new_earning = new Earning({...props});

  const flow = await User.findOneAndUpdate(
    {
      _id: req.user._id
    },
    {
      $push: {'cash_flow.earnings': new_earning},
      $inc: {
        'cash_flow.total': req.body.amount,
        'cash_flow.earnings_total': req.body.amount
      }
    }
  );
  if(!flow) return res.status(401).send("Invalid user or data");
  
  res.status(200).send(_.pick(new_earning, ["_id", "title", "description", "amount", "date"]));
});

router.post("/add_spendings", auth, async(req, res) => {
  const {error} = Spending_joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let props = _.pick(req.body, ["title", "description", "amount"]);
  const new_spending = new Spending({...props});

  const flow = await User.findOneAndUpdate(
    {
      _id: req.user._id
    },
    {
      $push: {'cash_flow.spendings': new_spending},
      $inc: {
        'cash_flow.total': - req.body.amount,
        'cash_flow.spendings_total': req.body.amount
      }
    }
  );
  if(!flow) return res.status(401).send("Invalid user or data");

  res.status(200).send(_.pick(new_spending, ["_id", "title", "description", "amount", "date"]));
});

router.delete("/assets/:id", auth, async(req, res) => {
  const delete_asset = await Asset.findOne({_id: req.params.id});
  if(!delete_asset) return res.status(400).send("Invalid Asset");

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $inc: {
      'cash_flow.total': - delete_asset.amount,
      'cash_flow.future_flow': - delete_asset.amount,
      'cash_flow.assets_total': - delete_asset.amount
    },
    $pull: { 'cash_flow.assets': req.params.id }}
  );

  await delete_asset.remove();
  res.status(200).send('Deleted');
});

router.delete("/liabilities/:id", auth, async(req, res) => {
  const delete_liability = await Liability.findOne({_id: req.params.id});
  if(!delete_liability) return res.status(400).send("Invalid Libility");

  await User.findOneAndUpdate(
    { _id: req.user._id},
    { $inc: {
      'cash_flow.total': delete_liability.amount,
      'cash_flow.future_flow': delete_liability.amount,
      'cash_flow.liabilities_total': - delete_liability.amount
    },
    $pull: { 'cash_flow.liabilities': req.params.id }}
  );

  await delete_liability.remove();
  res.status(200).send("Deleted");
});

module.exports = router;      