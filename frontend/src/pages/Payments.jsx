import React, { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import api from "../services/api";

export default function Payments({ user }) {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  const applicationId = searchParams.get("applicationId");

  const [payments, setPayments] = useState([]);
  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    amount: "",
    type: "rent",
    method: "upi",
    transactionReference: "",
  });

  // =========================
  // LOAD PAYMENTS
  // =========================
  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const paymentResponse = await api.get("/payments");

      setPayments(
        Array.isArray(paymentResponse.data)
          ? paymentResponse.data
          : []
      );

      // If tenant came from Pay Rent button
      if (applicationId) {
        const applicationResponse =
          await api.get("/applications");

        const found = applicationResponse.data.find(
          (a) =>
            String(a._id) === String(applicationId)
        );

        if (!found) {
          setError("Application not found.");
          return;
        }

        setApplication(found);

        setForm((prev) => ({
          ...prev,
          amount: found.propertyId?.rent || "",
        }));
      } else {
        setApplication(null);
      }
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not load payment information"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [applicationId]);

  // =========================
  // TENANT - CREATE PAYMENT
  // =========================
  const submitPayment = async (e) => {
    e.preventDefault();

    if (!application) {
      setError(
        "Please select an approved application."
      );
      return;
    }

    // Get owner ID automatically
    const receiverId =
      application.ownerId?._id ||
      application.ownerId ||
      application.propertyId?.ownerId?._id ||
      application.propertyId?.ownerId;

    if (!receiverId) {
      setError(
        "Owner information is not available."
      );
      return;
    }

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/payments", {
        applicationId: application._id,
        amount: Number(form.amount),
        type: form.type,
        method: form.method,
        receiverId: receiverId,
        transactionReference:
          form.transactionReference.trim(),
        status: "pending",
      });

      alert(
        "Payment created successfully!"
      );

      nav("/payments");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.response?.data?.error ||
          "Could not create payment"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // OWNER - CONFIRM PAYMENT
  // =========================
  const confirmPayment = async (paymentId) => {
    try {
      setError("");

      await api.patch(
        `/payments/${paymentId}`,
        {
          status: "success",
        }
      );

      alert(
        "Payment confirmed successfully!"
      );

      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not confirm payment"
      );
    }
  };

  // =========================
  // HELPERS
  // =========================
  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const statusText = (status) => {
    if (status === "success") {
      return "Success";
    }

    if (status === "failed") {
      return "Failed";
    }

    return "Pending";
  };

  const typeText = (type) => {
    return type === "deposit"
      ? "Deposit"
      : "Rent";
  };

  const methodText = (method) => {
    if (method === "bank_transfer") {
      return "Bank Transfer";
    }

    if (method === "upi") {
      return "UPI";
    }

    if (method === "card") {
      return "Card";
    }

    if (method === "cash") {
      return "Cash";
    }

    return method || "—";
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="page">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="section-head">
        <div>
          <p className="eyebrow">
            PAYMENTS
          </p>

          <h1>
            {user?.role === "owner"
              ? "Received Payments"
              : "My Payments"}
          </h1>

          <p className="muted">
            {user?.role === "owner"
              ? "View and confirm payments received from tenants."
              : "Manage your rent and deposit payments."}
          </p>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* ==================================================
          TENANT PAYMENT FORM
          ONLY TENANT CAN SEE THIS
      ================================================== */}
      {user?.role === "tenant" &&
        applicationId &&
        application && (
          <section className="card form-card">

            <h2>Make a Payment</h2>

            <p className="muted">
              {application.propertyId?.title ||
                "Property"}
            </p>

            <p className="muted">
              Rent: ₹
              {formatAmount(
                application.propertyId?.rent
              )}
            </p>

            <form
              className="form-grid"
              onSubmit={submitPayment}
            >

              {/* AMOUNT */}
              <label>
                Amount

                <input
                  required
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      amount:
                        e.target.value,
                    }))
                  }
                />
              </label>

              {/* PAYMENT TYPE */}
              <label>
                Payment Type

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type:
                        e.target.value,
                    }))
                  }
                >
                  <option value="rent">
                    Rent
                  </option>

                  <option value="deposit">
                    Deposit
                  </option>
                </select>
              </label>

              {/* PAYMENT METHOD */}
              <label>
                Payment Method

                <select
                  value={form.method}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      method:
                        e.target.value,
                    }))
                  }
                >
                  <option value="upi">
                    UPI
                  </option>

                  <option value="card">
                    Card
                  </option>

                  <option value="cash">
                    Cash
                  </option>

                  <option value="bank_transfer">
                    Bank Transfer
                  </option>
                </select>
              </label>

              {/* TRANSACTION REFERENCE */}
              <label>
                Transaction Reference

                <span className="hint">
                  optional
                </span>

                <input
                  value={
                    form.transactionReference
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      transactionReference:
                        e.target.value,
                    }))
                  }
                  placeholder="UPI123456"
                />
              </label>

              {/* BUTTONS */}
              <div className="actions span2">

                <button
                  type="submit"
                  className="primary"
                  disabled={saving}
                >
                  {saving
                    ? "Processing..."
                    : "Pay Now"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    nav("/payments")
                  }
                >
                  Cancel
                </button>

              </div>
            </form>
          </section>
        )}

      {/* =========================
          PAYMENT HISTORY
      ========================= */}
      {loading ? (
        <div className="empty">
          Loading payments...
        </div>
      ) : payments.length === 0 ? (
        <div className="empty">

          <h3>
            No payments yet
          </h3>

          <p>
            Your rent and deposit payments
            will appear here.
          </p>

        </div>
      ) : (
        <section>

          <h2>
            Payment History
          </h2>

          <div className="table">

            {payments.map((p) => {

              // Current logged-in user is payment receiver
              // (user.id comes from login/register, user._id from /auth/me)
              const currentUserId = user?._id || user?.id;
              const isReceiver =
                String(
                  p.receiverId?._id ||
                    p.receiverId
                ) ===
                String(currentUserId);

              return (
                <div
                  className="row"
                  key={p._id}
                >

                  {/* =========================
                      PAYMENT DETAILS
                  ========================= */}
                  <div>

                    <b>
                      ₹
                      {formatAmount(
                        p.amount
                      )}
                    </b>

                    <span>
                      {typeText(p.type)}
                      {" · "}
                      {methodText(
                        p.method
                      )}
                    </span>

                    {/* OWNER VIEW */}
                    {isReceiver ? (
                      <span>
                        From:{" "}
                        {p.payerId?.name ||
                          "Tenant"}
                      </span>
                    ) : (
                      /* TENANT VIEW */
                      <span>
                        To:{" "}
                        {p.receiverId?.name ||
                          "Owner"}
                      </span>
                    )}

                    {/* TRANSACTION REFERENCE */}
                    {p.transactionReference && (
                      <span>
                        Ref:{" "}
                        {
                          p.transactionReference
                        }
                      </span>
                    )}

                    {/* DATE */}
                    <span>
                      {formatDate(
                        p.paidAt ||
                          p.createdAt
                      )}
                    </span>

                  </div>

                  {/* =========================
                      STATUS + OWNER BUTTON
                  ========================= */}
                  <div className="actions">

                    <span
                      className={`status ${p.status}`}
                    >
                      {statusText(
                        p.status
                      )}
                    </span>

                    {/* 
                      ONLY OWNER / RECEIVER
                      CAN SEE THIS BUTTON
                    */}
                    {user?.role === "owner" &&
  p.status === "pending" && (
    <button
      className="primary"
      onClick={() => confirmPayment(p._id)}
    >
      Confirm Payment
    </button>
)}

                  </div>

                </div>
              );
            })}

          </div>
        </section>
      )}

    </div>
  );
}