/**
 * User Entity
 * Represents a system user.
 * Demonstrates encapsulation and controlled data access.
 */
export class User {
    private id: string;
    private name: string;
    private email: string;

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name.trim();
        this.email = email.trim();
    }

    /**
     * Update user's name
     */
    public updateName(newName: string): void {
        this.name = newName.trim();
    }

    /**
     * Update user's email
     */
    public updateEmail(newEmail: string): void {
        this.email = newEmail.trim();
    }

    // Getters (Encapsulation)
    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }
}