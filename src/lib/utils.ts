import clsx, { ClassValue } from "clsx"
import moment from "moment"
import { twMerge } from "tailwind-merge"
import { Primitive, z, ZodLiteral, ZodNever } from "zod"
import {
    PENDING_SUBSCRIPTION_DAYS,
    SUBSCRIPTIONS_STATUS,
} from "./global-variables"

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const ret: any = {}
    keys.forEach((key) => {
        ret[key] = obj[key]
    })
    return ret
}

export function omit<T extends {}, P extends keyof T>(
    obj: T,
    keys: P[]
): Omit<T, P> {
    const b = Object.fromEntries(
        Object.entries(obj).filter(([k, _]) => !keys.includes(k as P))
    )
    return b as Omit<T, P>
}

// get zod object keys recursively
export const zodKeys = <T extends z.ZodTypeAny>(schema: T): string[] => {
    // make sure schema is not null or undefined
    if (schema === null || schema === undefined) return []
    // check if schema is nullable or optional
    if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
        return zodKeys(schema.unwrap())
    // check if schema is an array
    if (schema instanceof z.ZodArray) return zodKeys(schema.element)
    // check if schema is an object
    if (schema instanceof z.ZodObject) {
        // get key/value pairs from schema
        const entries = Object.entries(schema.shape)
        // loop through key/value pairs
        return entries.flatMap(([key, value]) => {
            // get nested keys
            const nested =
                value instanceof z.ZodType
                    ? zodKeys(value).map((subKey) => `${key}.${subKey}`)
                    : []
            // return nested keys
            return nested.length ? nested : key
        })
    }
    // return empty array
    return []
}

// wrapper for server components before TS 5.1
export function asyncComponent<T, R>(
    fn: (arg: T) => Promise<R>
): (arg: T) => R {
    return fn as (arg: T) => R
}

export function getStatusColor(diff: number) {
    let statusColor = SUBSCRIPTIONS_STATUS.valid.bgColor

    if (diff <= PENDING_SUBSCRIPTION_DAYS)
        statusColor = SUBSCRIPTIONS_STATUS.expiring.bgColor

    if (diff < 0) statusColor = SUBSCRIPTIONS_STATUS.expired.bgColor

    return statusColor
}

// create union schema
type MappedZodLiterals<T extends readonly Primitive[]> = {
    -readonly [K in keyof T]: ZodLiteral<T[K]>
}

function createManyUnion<
    A extends Readonly<[Primitive, Primitive, ...Primitive[]]>
>(literals: A) {
    return z.union(
        literals.map((value) => z.literal(value)) as MappedZodLiterals<A>
    )
}

export function createUnionSchema<T extends readonly []>(values: T): ZodNever
export function createUnionSchema<T extends readonly [Primitive]>(
    values: T
): ZodLiteral<T[0]>
export function createUnionSchema<
    T extends readonly [Primitive, Primitive, ...Primitive[]]
>(values: T): z.ZodUnion<MappedZodLiterals<T>>
export function createUnionSchema<T extends readonly Primitive[]>(values: T) {
    if (values.length > 1) {
        return createManyUnion(
            values as typeof values & [Primitive, Primitive, ...Primitive[]]
        )
    } else if (values.length === 1) {
        return z.literal(values[0])
    } else if (values.length === 0) {
        return z.never()
    }
    throw new Error("Array must have a length")
}

/* const emptySchema = createUnionSchema([] as const)
const singletonSchema = createUnionSchema(["a"] as const)
const manySchema = createUnionSchema(["a", "b", "c"] as const)


type EmptyType = z.infer<typeof emptySchema>
type SingletonType = z.infer<typeof singletonSchema>
type ManyType = z.infer<typeof manySchema> */

export function calculateDiff(expirationDate: Date): number {
    const expiration = moment(expirationDate)
    const today = moment(Date.now())

    const days = expiration.diff(today, "days") + 1

    return days
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatMACAddress(address: string) {
    var r = /([a-z0-9]{2})([a-z0-9]{2})/i,
        str = address.replace(/[^a-z0-9]/gi, "")

    while (r.test(str)) {
        str = str.replace(r, "$1" + ":" + "$2")
    }

    return str.slice(0, 17)
}
