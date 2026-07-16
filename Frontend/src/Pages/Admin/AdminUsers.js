import React, { useEffect, useState } from "react";
import { Card, Container, Form, InputGroup, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import { adminUsersFetch, setUserAdmin } from "../../Redux/AdminUsers/AdminUserSlice";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.adminUsers);
  const { user: currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    dispatch(adminUsersFetch());
  }, [dispatch]);

  const toggleAdmin = (targetUser) => {
    setPendingId(targetUser.id);
    dispatch(setUserAdmin({ id: targetUser.id, admin: !targetUser.admin })).finally(() =>
      setPendingId(null)
    );
  };

  const filtered = users.filter((u) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin</span>
              <h2>Manage users</h2>
            </div>
          </div>
          <p className="sku mb-4">
            Grant or revoke admin access for existing accounts. New admins are created here, not
            during sign up - anyone can register a regular account, and an existing admin promotes
            them from this page.
          </p>
          <Card>
            <Card.Body>
              <Form>
                <InputGroup className="my-3">
                  <Form.Control
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email"
                  />
                </InputGroup>
              </Form>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((u) => (
                        <tr key={u.id}>
                          <td>
                            {u.firstName} {u.lastName}
                          </td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            <span className={`tag-badge ${u.admin ? "tag-badge--court" : ""}`}>
                              {u.admin ? "Admin" : "Customer"}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={u.admin ? "btn-outline btn-sm" : "btn-ink btn-sm"}
                              disabled={pendingId === u.id || (u.admin && u.id === currentUser?.id)}
                              onClick={() => toggleAdmin(u)}
                              title={
                                u.admin && u.id === currentUser?.id
                                  ? "You cannot remove your own admin access"
                                  : undefined
                              }
                            >
                              {pendingId === u.id
                                ? "..."
                                : u.admin
                                ? "Remove admin"
                                : "Make admin"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          {isLoading ? "Loading..." : "No users found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AdminUsers;
