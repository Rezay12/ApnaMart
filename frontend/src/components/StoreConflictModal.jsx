import React from 'react';
import { useCart } from '../context/CartContext';

export default function StoreConflictModal() {
  const { conflictModal, confirmSwitchStore, cancelSwitchStore } = useCart();

  if (!conflictModal.isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-0 py-3">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill text-warning"></i>
              Different Store Selected
            </h5>
            <button type="button" className="btn-close" onClick={cancelSwitchStore}></button>
          </div>
          <div className="modal-body py-4">
            <p className="mb-2 text-secondary">
              Your cart already contains items from <strong className="text-dark">{conflictModal.existingStoreName}</strong>.
            </p>
            <p className="mb-0 text-muted small">
              ApnaMart requires each pre-order pickup to belong to a single kirana store. Would you like to clear your current cart and switch to this store?
            </p>
          </div>
          <div className="modal-footer border-0 bg-light py-3">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={cancelSwitchStore}>
              Keep Current Cart
            </button>
            <button type="button" className="btn btn-apnamart-primary rounded-pill px-4" onClick={confirmSwitchStore}>
              Clear & Switch Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
