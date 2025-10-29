import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

export const useEventRegistration = ({ userId }) => {
  const [registering, setRegistering] = useState(false);

  const isRegistered = useCallback(
    (event) =>
      Array.isArray(event?.participants) &&
      event.participants.some((p) => String(p._id || p) === String(userId)),
    [userId],
  );

  const registerForEvent = useCallback(
    async (eventId, updateEvents) => {
      setRegistering(true);
      try {
        const res = await api.post(`/api/events/${eventId}/register`);
        if (typeof updateEvents === "function") {
          updateEvents((prev) =>
            prev.map((ev) =>
              ev._id === eventId
                ? { ...ev, participants: [...(ev.participants || []), userId] }
                : ev,
            ),
          );
        }
        toast.success(res.data?.message || "Successfully registered!", {
          position: "top-right",
          autoClose: 3000,
        });
        return { ok: true };
      } catch (err) {
        const msg = err.response?.data?.message || "Registration failed.";
        toast.error(msg, { position: "top-right", autoClose: 3000 });
        return { ok: false, error: msg };
      } finally {
        setRegistering(false);
      }
    },
    [userId],
  );

  return useMemo(
    () => ({ registering, isRegistered, registerForEvent }),
    [registering, isRegistered, registerForEvent],
  );
};

export default useEventRegistration;
