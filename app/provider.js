"use client"

import { useUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { useEffect } from "react"
import { db } from "../configs/db"
import { USER_TABLE } from "../configs/schema"

function Provider({ children }) {

    const { user } = useUser()

    useEffect(() => {
        user && CheckIsNewUser()
    }, [user])

    const CheckIsNewUser = async () => {
        // Check is User Already Exist 
        const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))

        console.log("Result => ", result)

        if (result?.length == 0) {
            // Insert New User if not exist
            const userResponse = await db.insert(USER_TABLE).values({
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                isMember: false
            }).returning({ id: USER_TABLE.id })

            console.log("User Response=>", userResponse)
        }

    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Provider
