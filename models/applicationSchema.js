import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"job",
        required:true
    },
    status: {
        type:String,
        enum:["applied","shortlisted","interview","selected","rejected"],
        default:"applied",
    },
  },
  {
    timestamps: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
